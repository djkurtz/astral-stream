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
  const ui = new HarmoniaUI(engine);

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

    // Starter Selection via keyboard 1-4, C for customize, R for randomize
    if (engine.getState().mode === 'character_customization') {
      if (e.code === 'Digit1') engine.chooseStarter(STARTER_OPTIONS[0].id);
      if (e.code === 'Digit2') engine.chooseStarter(STARTER_OPTIONS[1].id);
      if (e.code === 'Digit3') engine.chooseStarter(STARTER_OPTIONS[2].id);
      if (e.code === 'Digit4') engine.chooseStarter(STARTER_OPTIONS[3].id);
      if (e.code === 'KeyC') {
        ui.renderCustomizationModal();
        document.getElementById('modal-customization')?.classList.remove('hidden');
      }
      if (e.code === 'KeyR') {
        engine.randomizeCustomization();
      }
    }

    // In-world Quick-Wheel toggle via Q (Exploration mode)
    if (engine.getState().mode === 'exploration') {
      if (e.code === 'KeyQ') {
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

    // Toggle Smartphone ("HarmoniPhone") via Tab / P
    if (e.code === 'Tab' || e.code === 'KeyP') {
      e.preventDefault();
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

    // Starter selection clicks & customization buttons
    if (state.mode === 'character_customization') {
      const btnW = 200;
      const btnH = 30;
      const btnGap = 16;
      const btn1X = 1280 / 2 - btnW - btnGap / 2;
      const btn2X = 1280 / 2 + btnGap / 2;
      const btnY = 104;

      if (clickX >= btn1X && clickX <= btn1X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        ui.renderCustomizationModal();
        document.getElementById('modal-customization')?.classList.remove('hidden');
        return;
      }
      if (clickX >= btn2X && clickX <= btn2X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
        engine.randomizeCustomization();
        return;
      }

      const cardW = 260;
      const gap = 30;
      const startX = (1280 - (cardW * 4 + gap * 3)) / 2;
      const cardY = 175;
      const cardH = 510;

      STARTER_OPTIONS.forEach((opt, idx) => {
        const x = startX + idx * (cardW + gap);
        if (clickX >= x && clickX <= x + cardW && clickY >= cardY && clickY <= cardY + cardH) {
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
      const phoneW = Math.min(520, canvas.width - 24);
      const phoneH = Math.min(620, canvas.height - 20);
      const phoneX = (canvas.width - phoneW) / 2;
      const phoneY = (canvas.height - phoneH) / 2;

      // Bottom Navigation Bar with Badges, Close, and Dispatch
      const bottomBtnH = 34;
      const bottomBtnY = phoneY + phoneH - 46;
      const sideBtnW = Math.min(115, (phoneW - 60) / 3);
      const closeW = Math.min(150, (phoneW - 60) / 3 + 20);
      const gap = (phoneW - 40 - (sideBtnW * 2 + closeW)) / 2;
      const badgesBtnX = phoneX + 20;
      const closeBtnX = badgesBtnX + sideBtnW + gap;
      const dispatchBtnX = closeBtnX + closeW + gap;

      if (clickY >= bottomBtnY && clickY <= bottomBtnY + bottomBtnH) {
        if (clickX >= badgesBtnX && clickX <= badgesBtnX + sideBtnW) {
          engine.togglePhone(false);
          window.dispatchEvent(new CustomEvent('open-badges-modal'));
          return;
        }
        if (clickX >= closeBtnX && clickX <= closeBtnX + closeW) {
          engine.togglePhone(false);
          return;
        }
        if (clickX >= dispatchBtnX && clickX <= dispatchBtnX + sideBtnW) {
          engine.togglePhone(false);
          window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
          return;
        }
      }

      // App Tabs (6 Tabs)
      const tabs = ['messages', 'ensemble', 'repertoire', 'quests', 'calendar', 'dex'] as const;
      const tabW = (phoneW - 40) / tabs.length;
      const tabY = phoneY + 44;
      const tabH = 32;

      if (clickY >= tabY && clickY <= tabY + tabH && clickX >= phoneX + 20 && clickX <= phoneX + phoneW - 20) {
        const tabIdx = Math.floor((clickX - (phoneX + 20)) / tabW);
        if (tabIdx >= 0 && tabIdx < tabs.length) {
          engine.switchPhoneTab(tabs[tabIdx]);
          return;
        }
      }

      const activeTab = state.phoneTab || 'messages';
      const contentX = phoneX + 20;
      const contentY = phoneY + 84;
      const contentW = phoneW - 40;

      // In-tab shortcut buttons (Ensemble -> Badges, Calendar -> Dispatch)
      if (activeTab === 'ensemble') {
        const badgeSubBtnX = contentX + contentW - 130;
        const badgeSubBtnY = contentY + 10;
        const badgeSubBtnW = 118;
        const badgeSubBtnH = 26;
        if (clickX >= badgeSubBtnX && clickX <= badgeSubBtnX + badgeSubBtnW && clickY >= badgeSubBtnY && clickY <= badgeSubBtnY + badgeSubBtnH) {
          engine.togglePhone(false);
          window.dispatchEvent(new CustomEvent('open-badges-modal'));
          return;
        }
      }

      if (activeTab === 'calendar') {
        const dispatchSubBtnX = contentX + contentW - 130;
        const dispatchSubBtnY = contentY + 10;
        const dispatchSubBtnW = 118;
        const dispatchSubBtnH = 26;
        if (clickX >= dispatchSubBtnX && clickX <= dispatchSubBtnX + dispatchSubBtnW && clickY >= dispatchSubBtnY && clickY <= dispatchSubBtnY + dispatchSubBtnH) {
          engine.togglePhone(false);
          window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
          return;
        }
      }

      // Message item read click
      if (activeTab === 'messages' && state.phoneMessages) {
        const itemH = 88;
        state.phoneMessages.slice(0, 4).forEach((m, idx) => {
          const my = contentY + 36 + idx * (itemH + 8);
          if (clickX >= phoneX + 30 && clickX <= phoneX + phoneW - 30 && clickY >= my && clickY <= my + itemH) {
            engine.markPhoneMessageRead(m.id);
          }
        });
      }

      // Quest item selection click
      if (activeTab === 'quests' && state.quests) {
        const itemH = 68;
        state.quests.slice(0, 5).forEach((q, idx) => {
          const qy = contentY + 36 + idx * (itemH + 8);
          if (clickX >= phoneX + 30 && clickX <= phoneX + phoneW - 30 && clickY >= qy && clickY <= qy + itemH) {
            engine.setActiveQuest(q.id);
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
      // HarmoniPhone Shortcut Pill
      const unreadCount = state.phoneMessages ? state.phoneMessages.filter(m => !m.read).length : 0;
      const phonePillW = unreadCount > 0 ? 140 : 110;
      const phonePillX = Math.max(180, canvas.width - 450);
      if (canvas.width >= 700 && clickX >= phonePillX && clickX <= phonePillX + phonePillW && clickY >= 10 && clickY <= 44) {
        engine.togglePhone();
        return;
      }

      // Push Notification Toast
      const toastW = Math.min(560, canvas.width - 40);
      const toastX = (canvas.width - toastW) / 2;
      const toastY = state.hasPianoAccompaniment ? 96 : 64;
      if (state.activeNotification && clickX >= toastX && clickX <= toastX + toastW && clickY >= toastY && clickY <= toastY + 64) {
        engine.togglePhone(true);
        engine.switchPhoneTab('messages');
        return;
      }
    }

    // Harmonize encounter clicks
    if (state.mode === 'harmonize_wild') {
      const centerAvailableW = Math.max(260, canvas.width - 540);
      const btnW = Math.min(210, (centerAvailableW - 20) / 2);
      const btnH = 34;
      const gapBtn = 16;
      const totalBtnW = btnW * 2 + gapBtn;
      const repX = (canvas.width - totalBtnW) / 2;
      const repY = 138;
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

      const cardGap = 14;
      const cardW = Math.min(195, (canvas.width - 80 - cardGap * 3) / 4);
      const cardH = 70;
      const startX = (canvas.width - (cardW * 4 + cardGap * 3)) / 2;
      const cardY = state.harmonizeEncounter?.phase === 'tuning' ? 275 : 295;

      for (let i = 0; i < 4; i++) {
        const cx = startX + i * (cardW + cardGap);
        if (clickX >= cx && clickX <= cx + cardW && clickY >= cardY && clickY <= cardY + cardH) {
          engine.playHarmonizeNote(i);
          break;
        }
      }
      return;
    }

    // Pre-Battle Lineup Selection clicks
    if (state.mode === 'battle_lineup' && state.preBattle) {
      const leftX = 24;
      const leftW = Math.min(420, (canvas.width - 72) * 0.38);
      const rightX = leftX + leftW + 16;
      const rightW = canvas.width - rightX - 24;
      const maxLineup = state.preBattle.maxLineupSize || 4;
      const slotGap = Math.min(14, Math.max(8, (rightW - 400) / 4));
      const slotW = Math.min(150, (rightW - 32 - slotGap * 3) / 4);
      const slotH = maxLineup > 4 ? 96 : 125;
      const activeStartX = rightX + 16;
      const activeStartY = 80 + 56;

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
      const reserveY = activeStartY + (maxLineup > 4 ? (slotH + slotGap) * 2 : (slotH + slotGap)) + 12;
      const resStartX = rightX + 16;
      const resStartY = reserveY + 12;
      const rCardW = slotW;
      const rCardH = maxLineup > 4 ? 54 : 64;
      const rGap = slotGap;
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
      const btnW = Math.min(320, (canvas.width - 80) / 2);
      const btnH = 42;
      const btnY = Math.min(650, canvas.height - 48);
      const startX = canvas.width / 2 - btnW - 14;
      const cancelX = canvas.width / 2 + 14;

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
      const gap = Math.min(15, Math.max(8, (canvas.width - 600) / 16));
      const laneW = Math.min(260, (canvas.width - 60 - gap * 3) / 4);
      const laneH = 78;
      const startX = (canvas.width - (laneW * 4 + gap * 3)) / 2;
      const startY = 324;

      const sections = ['strings', 'woodwinds', 'brass', 'percussion'] as const;
      for (let i = 0; i < 4; i++) {
        const lx = startX + i * (laneW + gap);
        if (clickX >= lx && clickX <= lx + laneW && clickY >= startY && clickY <= startY + laneH) {
          engine.conductSection(sections[i]);
          return;
        }
      }

      // Section Action Card Clicks (y: 408..454)
      const actionCardY = 408;
      const actionCardH = 46;
      for (let i = 0; i < 4; i++) {
        const ax = startX + i * (laneW + gap);
        if (clickX >= ax && clickX <= ax + laneW && clickY >= actionCardY && clickY <= actionCardY + actionCardH) {
          engine.executeSectionAction(i);
          return;
        }
      }

      // Master Downbeat click on podium / cadence track
      const meterW = Math.min(560, canvas.width - 80);
      const meterX = canvas.width / 2 - meterW / 2;
      const meterY = 480;
      if (clickX >= meterX - 20 && clickX <= meterX + meterW + 20 && clickY >= meterY - 20 && clickY <= meterY + 80) {
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
