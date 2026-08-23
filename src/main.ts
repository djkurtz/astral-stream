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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
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

    // In-world Quick-Wheel toggle via Tab / Q (Exploration mode)
    if (engine.getState().mode === 'exploration') {
      if (e.code === 'Tab' || e.code === 'KeyQ') {
        e.preventDefault();
        engine.toggleQuickWheel();
      }
    }

    // Audition Battle Move Selection via keyboard 1-4, 5 / U for Pet Synergy Unison Attack
    if (engine.getState().mode === 'audition_battle') {
      if (e.code === 'Digit1') engine.executeBattleMove(0);
      if (e.code === 'Digit2') engine.executeBattleMove(1);
      if (e.code === 'Digit3') engine.executeBattleMove(2);
      if (e.code === 'Digit4') engine.executeBattleMove(3);
      if (e.code === 'Digit5' || e.code === 'KeyU') engine.executePetSynergy(0);
    }

    // Theory Challenge Answer Selection via keyboard 1-4
    if (engine.getState().mode === 'theory_challenge') {
      if (e.code === 'Digit1') engine.answerTheoryQuestion(0);
      if (e.code === 'Digit2') engine.answerTheoryQuestion(1);
      if (e.code === 'Digit3') engine.answerTheoryQuestion(2);
      if (e.code === 'Digit4') engine.answerTheoryQuestion(3);
      if (e.code === 'KeyR') engine.replayTheoryAudio();
    }

    // Harmonize Encounter Cadence Selection via keyboard 1-4, [R] Replay, [Space]/[Enter] Performance, [T] Tuning
    if (engine.getState().mode === 'harmonize_wild') {
      if (e.code === 'Digit1') engine.playHarmonizeNote(0);
      if (e.code === 'Digit2') engine.playHarmonizeNote(1);
      if (e.code === 'Digit3') engine.playHarmonizeNote(2);
      if (e.code === 'Digit4') engine.playHarmonizeNote(3);
      if (e.code === 'KeyR') engine.replayHarmonizeMelody();
      if (e.code === 'Space' || e.code === 'Enter') engine.startPerformancePhase();
      if (e.code === 'KeyT') engine.startTuningPhase();
    }

    // Pre-Battle Lineup Selection via keyboard Enter/Space to start, Escape to cancel
    if (engine.getState().mode === 'battle_lineup') {
      if (e.code === 'Enter' || e.code === 'Space') engine.confirmPreBattle();
      if (e.code === 'Escape') engine.cancelPreBattle();
    }

    // Competition Section Turn Actions via 1-4
    if (engine.getState().mode === 'competition') {
      if (e.code === 'Digit1') engine.executeSectionAction(0);
      if (e.code === 'Digit2') engine.executeSectionAction(1);
      if (e.code === 'Digit3') engine.executeSectionAction(2);
      if (e.code === 'Digit4') engine.executeSectionAction(3);
    }

    // Practice Shed toggle Grand Staff Visualizer via 'V'
    if (engine.getState().mode === 'practice') {
      if (e.code === 'KeyV') engine.toggleStaffVisualizer();
    }

    // Toggle Smartphone ("HarmoniPhone") via 'P'
    if (e.code === 'KeyP') {
      engine.togglePhone();
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

    // Quick-Wheel clicks (Exploration mode)
    if (state.mode === 'exploration' && state.showQuickWheel) {
      const unlocked = state.proficiency.unlockedInstruments;
      const cx = 1280 / 2;
      const cy = 720 / 2;
      const R = 180;
      const N = unlocked.length;

      for (let i = 0; i < N; i++) {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        const slotX = cx + Math.cos(angle) * R;
        const slotY = cy + Math.sin(angle) * R;
        if (Math.hypot(clickX - slotX, clickY - slotY) <= 38) {
          engine.selectQuickWheelInstrument(unlocked[i]);
          return;
        }
      }

      // Close if clicked outside the slots
      engine.toggleQuickWheel(false);
      return;
    }

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

    // Battle move clicks (4 Tactical Cards + Unison Attack button)
    if (state.mode === 'audition_battle') {
      const battle = state.auditionBattle;
      if (battle && battle.synergyMoves && battle.synergyMoves.length > 0) {
        const synW = 540;
        const synH = 38;
        const synX = (1280 - synW) / 2;
        const synY = 428;
        if (clickX >= synX && clickX <= synX + synW && clickY >= synY && clickY <= synY + synH) {
          engine.executePetSynergy(0);
          return;
        }
      }

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

    // Phone Modal Clicks
    if (state.phoneOpen || state.mode === 'phone_menu') {
      const phoneW = 520;
      const phoneH = 620;
      const phoneX = (1280 - phoneW) / 2;
      const phoneY = (720 - phoneH) / 2;

      // Close button
      const closeBtnW = 200;
      const closeBtnH = 34;
      const closeBtnX = (1280 - closeBtnW) / 2;
      const closeBtnY = phoneY + phoneH - 46;
      if (clickX >= closeBtnX && clickX <= closeBtnX + closeBtnW && clickY >= closeBtnY && clickY <= closeBtnY + closeBtnH) {
        engine.togglePhone(false);
        return;
      }

      // App Tabs
      const tabs = ['messages', 'calendar', 'quests', 'repertoire', 'dex'] as const;
      const tabW = (phoneW - 48) / tabs.length;
      const tabY = phoneY + 48;
      const tabH = 34;

      if (clickY >= tabY && clickY <= tabY + tabH && clickX >= phoneX + 24 && clickX <= phoneX + phoneW - 24) {
        const tabIdx = Math.floor((clickX - (phoneX + 24)) / tabW);
        if (tabIdx >= 0 && tabIdx < tabs.length) {
          engine.switchPhoneTab(tabs[tabIdx]);
          return;
        }
      }

      // Message item read click
      const activeTab = state.phoneTab || 'messages';
      if (activeTab === 'messages' && state.phoneMessages) {
        const contentY = phoneY + 92;
        const itemH = 92;
        state.phoneMessages.slice(0, 4).forEach((m, idx) => {
          const my = contentY + 36 + idx * (itemH + 8);
          if (clickX >= phoneX + 34 && clickX <= phoneX + phoneW - 34 && clickY >= my && clickY <= my + itemH) {
            engine.markPhoneMessageRead(m.id);
          }
        });
      }

      // Click outside phone closes it
      if (clickX < phoneX || clickX > phoneX + phoneW || clickY < phoneY || clickY > phoneY + phoneH) {
        engine.togglePhone(false);
      }
      return;
    }

    // Exploration HUD Clicks: Phone pill & Notification Toast
    if (state.mode === 'exploration') {
      // Phone HUD shortcut pill (x: 625..765, y: 10..44)
      if (clickX >= 625 && clickX <= 765 && clickY >= 10 && clickY <= 44) {
        engine.togglePhone();
        return;
      }

      // Push Notification Toast (x: 360..920, y: 64..128)
      if (state.activeNotification && clickX >= 360 && clickX <= 920 && clickY >= 64 && clickY <= 128) {
        engine.togglePhone(true);
        engine.switchPhoneTab('messages');
        return;
      }
    }

    // Harmonize encounter clicks
    if (state.mode === 'harmonize_wild') {
      const btnW = 230;
      const btnH = 36;
      const gapBtn = 20;
      const totalBtnW = btnW * 2 + gapBtn;
      const repX = (1280 - totalBtnW) / 2;
      const repY = 180;
      const phaseX = repX + btnW + gapBtn;

      if (clickX >= repX && clickX <= repX + btnW && clickY >= repY && clickY <= repY + btnH) {
        engine.replayHarmonizeMelody();
        return;
      }

      if (clickX >= phaseX && clickX <= phaseX + btnW && clickY >= repY && clickY <= repY + btnH) {
        if (state.harmonizeEncounter?.phase === 'tuning') {
          engine.startPerformancePhase();
        } else {
          engine.startTuningPhase();
        }
        return;
      }

      const cardW = 190;
      const cardH = 75;
      const gap = 16;
      const startX = (1280 - (cardW * 4 + gap * 3)) / 2;
      const cardY = 380;

      for (let i = 0; i < 4; i++) {
        const cx = startX + i * (cardW + gap);
        if (clickX >= cx && clickX <= cx + cardW && clickY >= cardY && clickY <= cardY + cardH) {
          engine.playHarmonizeNote(i);
          break;
        }
      }
      return;
    }

    // Pre-Battle Lineup Selection clicks
    if (state.mode === 'battle_lineup' && state.preBattle) {
      const rightX = 540;
      const rightY = 85;
      const slotW = 150;
      const slotH = 150;
      const slotGap = 16;
      const activeStartX = rightX + 20;
      const activeStartY = rightY + 65;
      const maxLineup = state.preBattle.maxLineupSize || 4;

      // Check clicks on active lineup slots
      for (let i = 0; i < state.ensemble.members.length; i++) {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const sx = activeStartX + col * (slotW + slotGap);
        const sy = activeStartY + row * (slotH + slotGap);
        if (clickX >= sx && clickX <= sx + slotW && clickY >= sy && clickY <= sy + slotH) {
          if (i > 0) { // player cannot be removed
            engine.toggleLineupMusician(state.ensemble.members[i].id);
          }
          return;
        }
      }

      // Check clicks on reserve musicians
      const reserveY = activeStartY + (maxLineup > 4 ? (slotH + slotGap) * 2 : (slotH + slotGap)) + 15;
      const resStartX = rightX + 20;
      const resStartY = reserveY + 15;
      const rCardW = 150;
      const rCardH = 70;
      const rGap = 16;
      const allOwned = [...state.recruitedMusicians, ...state.ensembleBox];
      const reserveMusicians = allOwned.filter(m => !state.ensemble.members.some(am => am.id === m.id));

      for (let idx = 0; idx < Math.min(8, reserveMusicians.length); idx++) {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const rx = resStartX + col * (rCardW + rGap);
        const ry = resStartY + row * (rCardH + rGap);
        if (clickX >= rx && clickX <= rx + rCardW && clickY >= ry && clickY <= ry + rCardH) {
          engine.toggleLineupMusician(reserveMusicians[idx].id);
          return;
        }
      }

      // Bottom action buttons
      const btnW = 340;
      const btnH = 45;
      const btnY = 650;
      const startX = 1280 / 2 - btnW - 20;
      const cancelX = 1280 / 2 + 20;

      if (clickX >= startX && clickX <= startX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        engine.confirmPreBattle();
        return;
      }
      if (clickX >= cancelX && clickX <= cancelX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        engine.cancelPreBattle();
        return;
      }
      return;
    }

    // Conducting Minigame & Section Attack Clicks
    if (state.mode === 'competition' && state.competition) {
      const laneW = 260;
      const laneH = 95;
      const gap = 15;
      const startX = (1280 - (laneW * 4 + gap * 3)) / 2;
      const startY = 360;

      const sections = ['strings', 'woodwinds', 'brass', 'percussion'] as const;
      for (let i = 0; i < 4; i++) {
        const lx = startX + i * (laneW + gap);
        if (clickX >= lx && clickX <= lx + laneW && clickY >= startY && clickY <= startY + laneH) {
          engine.conductSection(sections[i]);
          return;
        }
      }

      // Section Action Card Clicks (y: 460..516)
      const actionCardY = 460;
      const actionCardH = 56;
      for (let i = 0; i < 4; i++) {
        const ax = startX + i * (laneW + gap);
        if (clickX >= ax && clickX <= ax + laneW && clickY >= actionCardY && clickY <= actionCardY + actionCardH) {
          engine.executeSectionAction(i);
          return;
        }
      }

      // Master Downbeat click on podium / cadence track
      const meterW = 640;
      const meterX = 1280 / 2 - meterW / 2;
      const meterY = 535;
      if (clickX >= meterX - 40 && clickX <= meterX + meterW + 40 && clickY >= meterY - 30 && clickY <= meterY + 110) {
        engine.advanceConcertPerformance();
        return;
      }
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
