// Harmonia: Opus of the Ensemble - Main Entrypoint

import './style.css';
import { HarmoniaGameEngine } from './game';
import { HarmoniaRenderer } from './renderer';
import { HarmoniaUI } from './ui';
import { STARTER_OPTIONS, BATTLE_MOVES } from './data';
import { soundEngine } from './audio';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const engine = new HarmoniaGameEngine();
  const renderer = new HarmoniaRenderer(ctx);
  new HarmoniaUI(engine);

  // Resize handler
  const resizeCanvas = () => {
    canvas.width = 1280;
    canvas.height = 720;
    renderer.setSize(1280, 720);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Keyboard events
  window.addEventListener('keydown', (e) => {
    soundEngine.init();
    engine.handleKeyDown(e.code);

    // Starter Selection via keyboard 1-4
    if (engine.getState().mode === 'character_customization') {
      if (e.code === 'Digit1') engine.chooseStarter(STARTER_OPTIONS[0].id);
      if (e.code === 'Digit2') engine.chooseStarter(STARTER_OPTIONS[1].id);
      if (e.code === 'Digit3') engine.chooseStarter(STARTER_OPTIONS[2].id);
      if (e.code === 'Digit4') engine.chooseStarter(STARTER_OPTIONS[3].id);
    }

    // Audition Battle Move Selection via keyboard 1-3
    if (engine.getState().mode === 'audition_battle') {
      const moves = Object.keys(BATTLE_MOVES);
      if (e.code === 'Digit1' && moves[0]) engine.executeBattleMove(moves[0]);
      if (e.code === 'Digit2' && moves[1]) engine.executeBattleMove(moves[1]);
      if (e.code === 'Digit3' && moves[2]) engine.executeBattleMove(moves[2]);
    }
  });

  window.addEventListener('keyup', (e) => {
    engine.handleKeyUp(e.code);
  });

  // Canvas Click interactions
  canvas.addEventListener('click', (e) => {
    soundEngine.init();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const state = engine.getState();

    // Starter selection clicks
    if (state.mode === 'character_customization') {
      const cardW = 260;
      const gap = 30;
      const startX = (1280 - (cardW * 4 + gap * 3)) / 2;
      const cardY = 160;

      STARTER_OPTIONS.forEach((opt, idx) => {
        const x = startX + idx * (cardW + gap);
        if (clickX >= x && clickX <= x + cardW && clickY >= cardY && clickY <= cardY + 460) {
          engine.chooseStarter(opt.id);
        }
      });
      return;
    }

    // Battle move clicks
    if (state.mode === 'audition_battle') {
      const moveW = 260;
      const moveH = 80;
      const moveStartX = (1280 - (moveW * 3 + 40)) / 2;
      const moveY = 460;
      const moves = Object.keys(BATTLE_MOVES);

      moves.slice(0, 3).forEach((mKey, idx) => {
        const mx = moveStartX + idx * (moveW + 20);
        if (clickX >= mx && clickX <= mx + moveW && clickY >= moveY && clickY <= moveY + moveH) {
          engine.executeBattleMove(mKey);
        }
      });
      return;
    }

    // Dialogue advance click
    if (state.dialogue) {
      engine.advanceDialogue();
    }
  });

  // Main Animation Loop
  const loop = (time: number) => {
    engine.update(time);
    renderer.render(engine.getState());
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
