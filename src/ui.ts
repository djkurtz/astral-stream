// Harmonia: Opus of the Ensemble - UI & Modals Controller

import { HarmoniaGameEngine } from './game';

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

    // Practice Shed Launcher Button
    const btnPractice = document.getElementById('btn-practice');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        this.engine.startPracticeSession('metronome');
      });
    }

    // Fullscreen Toggle Button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Keyboard Shortcuts for Modals
    window.addEventListener('keydown', (e) => {
      const mode = this.engine.getState().mode;
      if (mode !== 'exploration') return;

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

    state.repertoire.forEach((piece) => {
      const card = document.createElement('div');
      card.className = 'repertoire-card';
      const isActive = state.ensemble.activePiece?.id === piece.id;

      let stars = '';
      for (let i = 0; i < piece.difficulty; i++) stars += '★';

      card.innerHTML = `
        <div class="piece-header">
          <span class="piece-title">${piece.title}</span>
          <span class="piece-diff">${stars}</span>
        </div>
        <div class="piece-composer">Composer: ${piece.composer} (${piece.genre})</div>
        <div class="piece-desc">${piece.description}</div>
        <div class="piece-reqs">Tier: ${piece.minEnsembleTier.toUpperCase()} | BPM: ${piece.bpm}</div>
        <button class="btn-select-piece ${isActive ? 'active' : ''}">${isActive ? 'Active Piece ✓' : 'Set as Active'}</button>
      `;

      const btnSelect = card.querySelector('.btn-select-piece');
      btnSelect?.addEventListener('click', () => {
        state.ensemble.activePiece = piece;
        this.renderRepertoireList();
      });

      listContainer.appendChild(card);
    });
  }

  public renderEnsembleRoster(): void {
    const rosterContainer = document.getElementById('ensemble-roster-list');
    if (!rosterContainer) return;

    const state = this.engine.getState();
    rosterContainer.innerHTML = '';

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
}
