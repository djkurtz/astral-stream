import { AstralGameEngine } from './game';
import { AstralRenderer } from './renderer';
import { AstralUIManager } from './ui';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Handle high-DPI scaling for Chromebooks
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || 800;
    const h = parent?.clientHeight || 600;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

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
