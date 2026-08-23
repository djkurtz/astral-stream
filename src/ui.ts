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

    // Practice Shed Launcher Button
    const btnPractice = document.getElementById('btn-practice');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        this.engine.startPracticeSession('metronome');
      });
    }

    // Keyboard Shortcuts for Modals
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR' && this.engine.getState().mode === 'exploration') {
        modalRepertoire?.classList.toggle('hidden');
        if (modalRepertoire && !modalRepertoire.classList.contains('hidden')) {
          this.renderRepertoireList();
        }
      }
      if (e.code === 'KeyE' && this.engine.getState().mode === 'exploration') {
        modalEnsemble?.classList.toggle('hidden');
        if (modalEnsemble && !modalEnsemble.classList.contains('hidden')) {
          this.renderEnsembleRoster();
        }
      }
      if (e.code === 'KeyP' && this.engine.getState().mode === 'exploration') {
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
}
