// Harmonia: Opus of the Ensemble - UI & Modals Controller

import { HarmoniaGameEngine } from './game';
import { ZoneId } from './types';
import { soundEngine } from './audio';
import { REPERTOIRE_DATABASE, ALL_INSTRUMENTS_INFO, calculateEffectiveSkill, WORLD_ZONES } from './data';

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

    // Festival & Concert Calendar Modal Toggle Button
    const btnCalendar = document.getElementById('btn-calendar');
    const modalCalendar = document.getElementById('modal-calendar');
    const btnCloseCalendar = document.getElementById('btn-close-calendar');

    if (btnCalendar && modalCalendar) {
      btnCalendar.addEventListener('click', () => {
        this.renderCalendarModal();
        modalCalendar.classList.remove('hidden');
      });
    }

    if (btnCloseCalendar && modalCalendar) {
      btnCloseCalendar.addEventListener('click', () => {
        modalCalendar.classList.add('hidden');
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

    window.addEventListener('open-repertoire-modal', () => {
      if (modalRepertoire) {
        this.renderRepertoireList();
        modalRepertoire.classList.remove('hidden');
      }
    });

    window.addEventListener('open-quests-modal', () => {
      if (modalQuests) {
        this.renderQuestsList();
        modalQuests.classList.remove('hidden');
      }
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
        const allModals = [modalRepertoire, modalEnsemble, modalQuests, modalDex, modalBadges, modalCustomization, modalMap, modalCalendar, modalSystem];
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
      if (e.code === 'KeyF') {
        modalCalendar?.classList.toggle('hidden');
        if (modalCalendar && !modalCalendar.classList.contains('hidden')) {
          this.renderCalendarModal();
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
        <div class="piece-desc">Collect all manuscript fragments scattered across Harmonia's shrines and vistas to reconstruct this masterwork.</div>
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

    /* ---------------- HARMONIA OVERWORLD ATLAS (RADIAL GEOGRAPHY) ---------------- */

  public renderWorldMapModal(): void {
    const container = document.getElementById('map-body');
    if (!container) return;
    const state = this.engine.getState();

    const regions: Record<ZoneId, { name: string; icon: string; cardinal: string; section: string; desc: string; secrets: string }> = {
      grand_hall: {
        name: 'The Central City',
        icon: '🏛️',
        cardinal: 'Central Hub',
        section: 'Sanctuary of Maestros',
        desc: 'The beating cultural heart of Harmonia where the four musical disciplines unite in grand orchestral glory.',
        secrets: 'The Grand Symphony Hall, High Conservatory of Maestros, Royal Archives, and Maestro\'s Forum.'
      },
      cavatina_village: {
        name: 'Cavatina Village',
        icon: '🎻',
        cardinal: 'West Cardinal Realm',
        section: 'Strings Section',
        desc: 'Cradle of stringed resonance, artisan luthiers, and the tranquil Melodic Rose Tavern.',
        secrets: 'Elder Timothy\'s Music Box, Master Marco\'s Forge, and the Clef Fountain.'
      },
      west_wilderness: {
        name: 'Lyre Valley',
        icon: '🌲',
        cardinal: 'West Connector Trail',
        section: 'Wild Strings Meadow',
        desc: 'Whispering willow glens where gentle breezes pluck harmonic chords from wild flora.',
        secrets: 'Silver Bow Glen Vista, lost Bach Minuet folio, and wild Vivace Hares.'
      },
      woodwind_woods: {
        name: 'Woodwind Woods',
        icon: '🪈',
        cardinal: 'East Cardinal Realm',
        section: 'Woodwinds Section',
        desc: 'Sunlit canopies and reed riverbeds filled with the syncopated trills of sylvan jazz ensembles.',
        secrets: 'Bandleader Sylvan\'s Canopy Stage and the Bellflower Basin Vista.'
      },
      east_wilderness: {
        name: 'Breeze Glade',
        icon: '🍃',
        cardinal: 'East Connector Trail',
        section: 'Wild Reedmarsh',
        desc: 'Misty bamboo thickets and babbling brooks vibrating in pure melodic fourths and fifths.',
        secrets: 'Zephyr Falls Vista and lost Debussy Rêverie manuscript.'
      },
      brass_citadel: {
        name: 'The Brass Citadel',
        icon: '🎺',
        cardinal: 'North Cardinal Realm',
        section: 'Brass Section',
        desc: 'Gilded ramparts and soaring bastions projecting triumphant fanfares across the realm.',
        secrets: 'Baroness Vesta\'s Echo Amphitheater and the Gilded Sunlit Pinnacle.'
      },
      north_wilderness: {
        name: 'Echo Canyon',
        icon: '🏜️',
        cardinal: 'North Connector Trail',
        section: 'Wild Golden Steppes',
        desc: 'Red rock canyons and natural acoustic arches providing pristine sonic reflection.',
        secrets: 'Resonance Peak Vista and lost Vivaldi Spring quartet score.'
      },
      percussion_peaks: {
        name: 'Percussion Peaks',
        icon: '🥁',
        cardinal: 'South Cardinal Realm',
        section: 'Percussion Section',
        desc: 'Stepped mountain ghats and volcanic taiko monasteries resonating with ancient primal pulse.',
        secrets: 'Chieftain Ronin\'s Mountbeat Stage and the High Ridge Monolith.'
      },
      south_wilderness: {
        name: 'Rumble Gorge',
        icon: '🌋',
        cardinal: 'South Connector Trail',
        section: 'Wild Rhythm Caverns',
        desc: 'Deep subterranean basalt chasms where tectonic rumbles instill unwavering tempo stability.',
        secrets: 'Echoing Caldera Vista and lost Tchaikovsky Dance score.'
      }
    };

    let selectedZone: ZoneId = state.currentZone;
    let currentInspected: ZoneId | null = null;

    const renderInspector = (zoneId: ZoneId) => {
      if (currentInspected === zoneId) return;
      currentInspected = zoneId;
      const reg = regions[zoneId];
      const isCurrent = state.currentZone === zoneId;
      const isDiscovered = state.discoveredZones[zoneId];
      const insp = container.querySelector('#atlas-inspector-content');
      if (!insp) return;

      insp.innerHTML = `
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 24px;">${reg.icon}</span>
            <span style="font-size: 18px; font-weight: 800; color: #f8fafc; font-family: 'Cinzel', serif;">${reg.name}</span>
            <span style="font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; background: ${isCurrent ? 'rgba(251,191,36,0.2)' : (isDiscovered ? 'rgba(56,189,248,0.2)' : 'rgba(100,116,139,0.2)')}; color: ${isCurrent ? '#fbbf24' : (isDiscovered ? '#38bdf8' : '#94a3b8')};">
              ${isCurrent ? '📍 YOU ARE HERE' : (isDiscovered ? '✓ DISCOVERED' : '🔒 UNEXPLORED')}
            </span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #38bdf8; margin-bottom: 6px;">[${reg.cardinal}] • ${reg.section}</div>
          <div style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">${reg.desc}</div>
          <div style="font-size: 12px; color: #fbbf24; margin-top: 4px;">✨ <strong>Features:</strong> ${reg.secrets}</div>
        </div>
        <div>
          ${!isCurrent && isDiscovered ? `
            <button id="btn-fast-travel" style="background: linear-gradient(135deg, #38bdf8, #0284c7); border: none; color: #0f172a; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px;">
              ⚡ Travel to Region
            </button>
          ` : ''}
        </div>
      `;

      const btnTravel = insp.querySelector('#btn-fast-travel');
      if (btnTravel) {
        btnTravel.addEventListener('click', () => {
          this.engine.warpToZone(zoneId, WORLD_ZONES[zoneId].defaultSpawn);
          document.getElementById('modal-map')?.classList.add('hidden');
        });
      }
    };

    container.innerHTML = `
      <div class="atlas-container">
        <!-- Interactive Cartography Canvas (Hub & Spoke Compass Layout) -->
        <div class="atlas-map-canvas">
          <svg viewBox="0 0 800 480" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.6));">
            <defs>
              <linearGradient id="roadH" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.8" />
              </linearGradient>
              <linearGradient id="roadV" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#eab308" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#ec4899" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.8" />
              </linearGradient>
            </defs>

            <!-- Compass Background Grid -->
            <rect width="800" height="480" fill="#0b1329" />
            <circle cx="400" cy="240" r="180" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="2" stroke-dasharray="4,4" />
            <circle cx="400" cy="240" r="100" fill="none" stroke="rgba(251, 191, 36, 0.08)" stroke-width="2" stroke-dasharray="4,4" />

            <!-- Connecting Highways (Hub and Spoke with Multi-Layer Glow) -->
            <!-- Underglow -->
            <line x1="120" y1="240" x2="680" y2="240" stroke="rgba(56, 189, 248, 0.3)" stroke-width="10" stroke-linecap="round" />
            <line x1="400" y1="70" x2="400" y2="410" stroke="rgba(234, 179, 8, 0.3)" stroke-width="10" stroke-linecap="round" />
            <!-- Main Trade Arteries -->
            <line x1="120" y1="240" x2="680" y2="240" stroke="url(#roadH)" stroke-width="4" stroke-dasharray="8,6" />
            <line x1="400" y1="70" x2="400" y2="410" stroke="url(#roadV)" stroke-width="4" stroke-dasharray="8,6" />

            <!-- NODES -->
            <!-- 1. North: Brass Citadel -->
            <g class="atlas-node" id="node-brass_citadel" transform="translate(400, 70)">
              <circle r="34" fill="#78350f" stroke="#eab308" stroke-width="3" />
              <text text-anchor="middle" y="7" font-size="22">🎺</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Brass Citadel</text>
            </g>

            <!-- 2. North Wilds: Echo Canyon -->
            <g class="atlas-node" id="node-north_wilderness" transform="translate(400, 155)">
              <circle r="22" fill="#9a3412" stroke="#d97706" stroke-width="2" />
              <text text-anchor="middle" y="5" font-size="15">🏜️</text>
              <text text-anchor="start" x="28" y="4" fill="#cbd5e1" font-size="11" font-weight="600" font-family="Inter">Echo Canyon</text>
            </g>

            <!-- 3. East: Woodwind Woods -->
            <g class="atlas-node" id="node-woodwind_woods" transform="translate(680, 240)">
              <circle r="34" fill="#064e3b" stroke="#10b981" stroke-width="3" />
              <text text-anchor="middle" y="7" font-size="22">🪈</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Woodwinds</text>
            </g>

            <!-- 4. East Wilds: Breeze Glade -->
            <g class="atlas-node" id="node-east_wilderness" transform="translate(540, 240)">
              <circle r="22" fill="#065f46" stroke="#059669" stroke-width="2" />
              <text text-anchor="middle" y="5" font-size="15">🍃</text>
              <text text-anchor="middle" y="36" fill="#cbd5e1" font-size="11" font-weight="600" font-family="Inter">Breeze Glade</text>
            </g>

            <!-- 5. South: Percussion Peaks -->
            <g class="atlas-node" id="node-percussion_peaks" transform="translate(400, 410)">
              <circle r="34" fill="#3b0764" stroke="#8b5cf6" stroke-width="3" />
              <text text-anchor="middle" y="7" font-size="22">🥁</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Percussion</text>
            </g>

            <!-- 6. South Wilds: Rumble Gorge -->
            <g class="atlas-node" id="node-south_wilderness" transform="translate(400, 325)">
              <circle r="22" fill="#581c87" stroke="#7c3aed" stroke-width="2" />
              <text text-anchor="middle" y="5" font-size="15">🌋</text>
              <text text-anchor="start" x="28" y="4" fill="#cbd5e1" font-size="11" font-weight="600" font-family="Inter">Rumble Gorge</text>
            </g>

            <!-- 7. West: Cavatina Village -->
            <g class="atlas-node" id="node-cavatina_village" transform="translate(120, 240)">
              <circle r="34" fill="#0c4a6e" stroke="#38bdf8" stroke-width="3" />
              <text text-anchor="middle" y="7" font-size="22">🎻</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Cavatina</text>
            </g>

            <!-- 8. West Wilds: Lyre Valley -->
            <g class="atlas-node" id="node-west_wilderness" transform="translate(260, 240)">
              <circle r="22" fill="#0369a1" stroke="#0ea5e9" stroke-width="2" />
              <text text-anchor="middle" y="5" font-size="15">🌲</text>
              <text text-anchor="middle" y="36" fill="#cbd5e1" font-size="11" font-weight="600" font-family="Inter">Lyre Valley</text>
            </g>

            <!-- 9. CENTER: Grand Symphony Hall -->
            <g class="atlas-node" id="node-grand_hall" transform="translate(400, 240)">
              <circle r="44" fill="#831843" stroke="#ec4899" stroke-width="4" />
              <text text-anchor="middle" y="8" font-size="26">🏛️</text>
              <text text-anchor="middle" y="58" fill="#f8fafc" font-size="13" font-weight="800" font-family="Inter">Grand Hall</text>
            </g>

            <!-- Pulsing Current Location Pin -->
            <g id="player-pin">
              ${this.renderPlayerPin(state.currentZone)}
            </g>
          </svg>
        </div>

        <!-- Sleek Inspector Details Panel -->
        <div class="atlas-inspector" id="atlas-inspector-content">
          <!-- Populated dynamically -->
        </div>

        <!-- Quick Region Selector Pills -->
        <div class="atlas-node-pills">
          ${(Object.keys(regions) as ZoneId[]).map(z => `
            <button class="atlas-pill ${state.currentZone === z ? 'active' : ''}" data-zone="${z}">
              <span>${regions[z].icon}</span>
              <span>${regions[z].name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    renderInspector(selectedZone);

    // Add click/hover listeners to all SVG nodes
    (Object.keys(regions) as ZoneId[]).forEach(z => {
      const el = container.querySelector(`#node-${z}`);
      if (el) {
        el.addEventListener('click', () => {
          selectedZone = z;
          renderInspector(z);
          container.querySelectorAll('.atlas-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-zone') === z));
        });
        el.addEventListener('mouseenter', () => renderInspector(z));
      }
    });

    // Add click listeners to pills
    container.querySelectorAll('.atlas-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const z = (e.currentTarget as HTMLElement).getAttribute('data-zone') as ZoneId;
        if (z) {
          selectedZone = z;
          renderInspector(z);
          container.querySelectorAll('.atlas-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-zone') === z));
        }
      });
    });
  }

  private renderPlayerPin(zone: ZoneId): string {
    const coords: Record<ZoneId, { x: number; y: number }> = {
      grand_hall: { x: 400, y: 195 },
      cavatina_village: { x: 120, y: 195 },
      west_wilderness: { x: 260, y: 205 },
      woodwind_woods: { x: 680, y: 195 },
      east_wilderness: { x: 540, y: 205 },
      brass_citadel: { x: 400, y: 25 },
      north_wilderness: { x: 400, y: 120 },
      percussion_peaks: { x: 400, y: 365 },
      south_wilderness: { x: 400, y: 290 }
    };
    const pt = coords[zone] || { x: 400, y: 195 };
    return `
      <circle cx="${pt.x}" cy="${pt.y}" r="8" fill="#fbbf24">
        <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <text x="${pt.x}" y="${pt.y - 12}" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">YOU</text>
    `;
  }

  /* ---------------- FESTIVAL & CONCERT COMPETITION CALENDAR ---------------- */

  public renderCalendarModal(): void {
    const container = document.getElementById('calendar-body');
    if (!container) return;
    const state = this.engine.getState();
    const player = state.ensemble.members[0];

    container.innerHTML = '';

    const header = document.createElement('div');
    header.style.marginBottom = '16px';
    header.innerHTML = `
      <div style="font-size: 16px; font-weight: 800; color: #f8fafc;">🎪 Harmonia Seasonal Grand Concert Series</div>
      <div style="font-size: 13px; color: #94a3b8;">Meet the ensemble tier, proficiency, and entry requirements to compete in prestigious regional tournaments!</div>
    `;
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    state.calendarEvents.forEach(event => {
      const card = document.createElement('div');
      const isCompleted = state.completedEvents.includes(event.id);
      card.className = `event-card ${isCompleted ? 'completed' : ''}`;

      // Check requirements
      const tierRank: Record<string, number> = { solo: 1, duet: 2, trio: 3, quartet: 4, chamber: 6, symphony: 8 };
      const currentRank = state.ensemble.members.length;
      const requiredRank = tierRank[event.tierRequirement] || 1;
      const tierMet = currentRank >= requiredRank;

      const playerSkill = player ? calculateEffectiveSkill(player, state.proficiency, player.instrumentId) : 0;
      const skillMet = !event.statRequirements.minEffectiveSkill || playerSkill >= event.statRequirements.minEffectiveSkill;

      const sectionMet = !event.statRequirements.requiredSection || state.ensemble.members.some(m => m.section === event.statRequirements.requiredSection);
      const tempoMet = !event.statRequirements.minTempoStability || (player && player.stats.tempoStability >= event.statRequirements.minTempoStability);
      const sightMet = !event.statRequirements.minSightReading || (player && player.stats.sightReading >= event.statRequirements.minSightReading);
      
      const badgeCount = state.badges.filter(b => b.obtained).length;
      const badgesMet = !event.statRequirements.requiredBadges || badgeCount >= event.statRequirements.requiredBadges;

      const feeMet = state.wallet.gold >= event.entryFeeGold;
      const allMet = tierMet && skillMet && sectionMet && tempoMet && sightMet && badgesMet;

      card.innerHTML = `
        <div class="event-header">
          <div>
            <span class="event-title">${event.name}</span>
            <div class="event-meta">
              <span>📅 ${event.seasonDay}</span>
              <span>📍 ${event.venueName}</span>
              <span>👥 ${event.tierRequirement.toUpperCase()} Tier</span>
            </div>
          </div>
          <div>
            ${isCompleted 
              ? '<span style="color: #10b981; font-weight: bold; font-size: 14px;">🏆 VICTORIOUS ✓</span>'
              : `<span style="color: #fbbf24; font-weight: bold; font-size: 13px;">Entry Fee: ${event.entryFeeGold} ♪</span>`}
          </div>
        </div>

        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.4;">${event.description}</div>

        <div class="event-reqs-box">
          <span style="font-weight: bold; color: #94a3b8;">Requirements:</span>
          <span class="req-pill ${tierMet ? 'met' : 'unmet'}">${event.tierRequirement.toUpperCase()} Tier (${currentRank}/${requiredRank} musicians)</span>
          ${event.statRequirements.minEffectiveSkill ? `<span class="req-pill ${skillMet ? 'met' : 'unmet'}">Skill ★${event.statRequirements.minEffectiveSkill}+ (Current: ${playerSkill})</span>` : ''}
          ${event.statRequirements.requiredSection ? `<span class="req-pill ${sectionMet ? 'met' : 'unmet'}">${event.statRequirements.requiredSection.toUpperCase()} Musician Present</span>` : ''}
          ${event.statRequirements.minTempoStability ? `<span class="req-pill ${tempoMet ? 'met' : 'unmet'}">Tempo Stability ≥ ${event.statRequirements.minTempoStability}</span>` : ''}
          ${event.statRequirements.minSightReading ? `<span class="req-pill ${sightMet ? 'met' : 'unmet'}">Sight-Reading ≥ ${event.statRequirements.minSightReading}</span>` : ''}
          ${event.statRequirements.requiredBadges ? `<span class="req-pill ${badgesMet ? 'met' : 'unmet'}">Clef Badges: ${badgeCount}/${event.statRequirements.requiredBadges}</span>` : ''}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <div style="font-size: 12px; color: #10b981; font-weight: 600;">
            🎁 Prizes: +${event.rewardGold} ♪ Notes, +${event.rewardSparks} ✨ Sparks, +${event.rewardStars} ★ Prestige
          </div>
          <div>
            ${!isCompleted ? `
              <button class="btn-enter-event" data-id="${event.id}" ${(!allMet || !feeMet) ? 'disabled' : ''}>
                ${!feeMet ? 'Insufficient Notes' : (!allMet ? 'Requirements Locked' : '🎪 Register & Compete')}
              </button>
            ` : ''}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Event register buttons
    container.querySelectorAll('.btn-enter-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id && this.engine.enterFestivalCompetition(id)) {
          const modalCal = document.getElementById('modal-calendar');
          modalCal?.classList.add('hidden');
        }
      });
    });
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
            <div><strong style="color: #38bdf8;">[M]</strong> : Harmonia Overworld Atlas</div>
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
