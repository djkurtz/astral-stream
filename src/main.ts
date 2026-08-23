// Harmonia: Opus of the Ensemble - Main Entrypoint

import './style.css';
import { HarmoniaGameEngine } from './game';
import { HarmoniaRenderer } from './renderer';
import { HarmoniaUI } from './ui';
import { STARTER_OPTIONS } from './data';
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    soundEngine.init();
    engine.handleKeyDown(e.code);

    // Starter Selection via keyboard 1-4
    if (engine.getState().mode === 'character_customization') {
      if (e.code === 'Digit1') engine.chooseStarter(STARTER_OPTIONS[0].id);
      if (e.code === 'Digit2') engine.chooseStarter(STARTER_OPTIONS[1].id);
      if (e.code === 'Digit3') engine.chooseStarter(STARTER_OPTIONS[2].id);
      if (e.code === 'Digit4') engine.chooseStarter(STARTER_OPTIONS[3].id);
    }

    // Audition Battle Move Selection via keyboard 1-4 (matching active combatant's instrument)
    if (engine.getState().mode === 'audition_battle') {
      if (e.code === 'Digit1') engine.executeBattleMove(0);
      if (e.code === 'Digit2') engine.executeBattleMove(1);
      if (e.code === 'Digit3') engine.executeBattleMove(2);
      if (e.code === 'Digit4') engine.executeBattleMove(3);
    }

    // Theory Challenge Answer Selection via keyboard 1-4
    if (engine.getState().mode === 'theory_challenge') {
      if (e.code === 'Digit1') engine.answerTheoryQuestion(0);
      if (e.code === 'Digit2') engine.answerTheoryQuestion(1);
      if (e.code === 'Digit3') engine.answerTheoryQuestion(2);
      if (e.code === 'Digit4') engine.answerTheoryQuestion(3);
      if (e.code === 'KeyR') engine.replayTheoryAudio();
    }

    // Harmonize Encounter Cadence Selection via keyboard 1-4
    if (engine.getState().mode === 'harmonize_wild') {
      if (e.code === 'Digit1') engine.playHarmonizeNote(0);
      if (e.code === 'Digit2') engine.playHarmonizeNote(1);
      if (e.code === 'Digit3') engine.playHarmonizeNote(2);
      if (e.code === 'Digit4') engine.playHarmonizeNote(3);
    }
  });

  window.addEventListener('keyup', (e) => {
    engine.handleKeyUp(e.code);
  });

  // Mouse Move tracking for tooltips & hover cards
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    renderer.setMousePos((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
  });

  canvas.addEventListener('mouseleave', () => {
    renderer.setMousePos(-1, -1);
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

    // Battle move clicks (4 Tactical Cards matching active combatant's instrument)
    if (state.mode === 'audition_battle') {
      const moveW = 250;
      const moveH = 68;
      const moveStartX = (1280 - (moveW * 4 + 45)) / 2;
      const moveY = 475;

      [0, 1, 2, 3].forEach((idx) => {
        const mx = moveStartX + idx * (moveW + 15);
        if (clickX >= mx && clickX <= mx + moveW && clickY >= moveY && clickY <= moveY + moveH) {
          engine.executeBattleMove(idx);
        }
      });
      return;
    }

    // Theory challenge clicks
    if (state.mode === 'theory_challenge' && state.theoryChallenge) {
      const ch = state.theoryChallenge;
      const q = ch.questions[ch.currentQuestionIndex];
      if (q && q.notesToPlay && clickX >= 1280 / 2 - 120 && clickX <= 1280 / 2 + 120 && clickY >= 240 && clickY <= 284) {
        engine.replayTheoryAudio();
        return;
      }

      const optW = 460;
      const optH = 75;
      const startY = q && q.notesToPlay ? 310 : 250;
      const gapY = 20;

      for (let idx = 0; idx < (q ? q.options.length : 0); idx++) {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const ox = col === 0 ? 1280 / 2 - optW - 15 : 1280 / 2 + 15;
        const oy = startY + row * (optH + gapY);
        if (clickX >= ox && clickX <= ox + optW && clickY >= oy && clickY <= oy + optH) {
          engine.answerTheoryQuestion(idx);
          break;
        }
      }
      return;
    }

    // Harmonize encounter clicks
    if (state.mode === 'harmonize_wild') {
      const cardW = 190;
      const cardH = 80;
      const gap = 16;
      const startX = (1280 - (cardW * 4 + gap * 3)) / 2;
      const cardY = 480;

      for (let i = 0; i < 4; i++) {
        const cx = startX + i * (cardW + gap);
        if (clickX >= cx && clickX <= cx + cardW && clickY >= cardY && clickY <= cardY + cardH) {
          engine.playHarmonizeNote(i);
          break;
        }
      }
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
