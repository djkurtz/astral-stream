import { AstralGameEngine } from './game';
import { AstralRenderer } from './renderer';
import { AstralUIManager } from './ui';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Fixed virtual resolution for crisp pixel art and stable coordinates
  canvas.width = 800;
  canvas.height = 600;

  const engine = new AstralGameEngine();
  const renderer = new AstralRenderer(canvas);
  const ui = new AstralUIManager(engine);

  // Initial UI draw
  ui.updateUI();

  // Main Loop
  let lastUiUpdate = 0;
  function loop(now: number) {
    engine.update(now);
    renderer.render(engine.getState());

    if (now - lastUiUpdate > 80) {
      ui.updateUI();
      lastUiUpdate = now;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
