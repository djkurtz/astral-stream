import { GameEngine } from './game';
import { SpaceRenderer } from './renderer';
import { createInitialState, loadGame } from './state';
import { UIManager } from './ui';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Load existing save or create new
  const savedState = loadGame();
  const state = savedState || createInitialState();

  const renderer = new SpaceRenderer(canvas);
  const engine = new GameEngine(state);
  const ui = new UIManager(state, engine);

  // Click on Canvas to interact
  canvas.addEventListener('click', (e) => {
    if (state.viewMode === 'system') {
      const clickedBody = renderer.getBodyAtScreenPos(e.clientX, e.clientY, state);
      if (clickedBody) {
        state.selectedBodyId = clickedBody.id;
        ui.renderTabContent();
      }
    } else {
      const clickedPlot = renderer.getSurfacePlotAtScreenPos(e.clientX, e.clientY, state);
      if (clickedPlot) {
        ui.switchTab('base');
      }
    }
  });

  // Double click in system view to zoom into surface
  canvas.addEventListener('dblclick', (e) => {
    if (state.viewMode === 'system') {
      const clickedBody = renderer.getBodyAtScreenPos(e.clientX, e.clientY, state);
      if (clickedBody && clickedBody.colonized) {
        state.selectedBodyId = clickedBody.id;
        ui.setViewMode('surface');
        ui.renderTabContent();
      }
    }
  });

  // Main Game & Animation Loop
  let lastUiUpdate = 0;
  function loop(now: number) {
    engine.update(now);
    renderer.render(state);

    // Throttle DOM updates to ~10 times per second for smooth performance
    if (now - lastUiUpdate > 100) {
      ui.updateUI();
      lastUiUpdate = now;
    }

    requestAnimationFrame(loop);
  }

  // Initial draw & render
  ui.renderTabContent();
  requestAnimationFrame(loop);
});
