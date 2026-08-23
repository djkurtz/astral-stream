import { GameState, Harmonipet, Musician, PlayerCustomization, WorldObstacle, WorldNPC } from './types';
import { WORLD_ZONES, STARTER_OPTIONS, getBattleMovesForMusician } from './data';

export class HarmoniaRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 1280;
  private height: number = 720;
  private mousePos: { x: number; y: number } = { x: -1, y: -1 };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public setSize(w: number, h: number): void {
    this.width = w;
    this.height = h;
  }

  public setMousePos(x: number, y: number): void {
    this.mousePos = { x, y };
  }

  public render(state: GameState): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (state.mode === 'character_customization') {
      this.renderCharacterCustomization(state);
      return;
    }

    if (state.mode === 'practice') {
      this.renderPracticeShed(state);
      this.renderDialogue(state);
      return;
    }

    if (state.mode === 'theory_challenge') {
      this.renderTheoryChallenge(state);
      this.renderDialogue(state);
      return;
    }

    if (state.mode === 'audition_battle') {
      this.renderAuditionBattle(state);
      this.renderDialogue(state);
      return;
    }

    if (state.mode === 'competition') {
      this.renderConcertCompetition(state);
      this.renderDialogue(state);
      return;
    }

    if (state.mode === 'harmonize_wild') {
      this.renderHarmonizeWild(state);
      this.renderDialogue(state);
      return;
    }

    // Default: Exploration Mode
    this.renderWorldMap(state);
    this.renderHUD(state);
    this.renderDialogue(state);
  }

  /* ---------------- CHARACTER CUSTOMIZATION / STARTER SCREEN ---------------- */

  private renderCharacterCustomization(state: GameState): void {
    const ctx = this.ctx;
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 36px "Cinzel", "Georgia", serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎼 HARMONIA: OPUS OF THE ENSEMBLE 🐾', this.width / 2, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('Choose your Starter Instrument and bond with your musical Harmonipet familiar:', this.width / 2, 120);

    // 4 Starter Cards
    const cardW = 260;
    const cardH = 460;
    const gap = 30;
    const startX = (this.width - (cardW * 4 + gap * 3)) / 2;
    const cardY = 160;

    STARTER_OPTIONS.forEach((opt, idx) => {
      const x = startX + idx * (cardW + gap);
      // Card Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = opt.pet.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Instrument Section Pill
      ctx.fillStyle = opt.pet.color;
      ctx.beginPath();
      ctx.roundRect(x + 20, cardY + 18, cardW - 40, 28, 8);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.sectionName.toUpperCase(), x + cardW / 2, cardY + 32);

      // Pet Avatar & Sprite
      ctx.textBaseline = 'alphabetic';
      this.drawPixelPet(ctx, x + cardW / 2, cardY + 115, opt.pet, state.time);

      // Pet Name & Species
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(opt.name, x + cardW / 2, cardY + 185);

      ctx.fillStyle = opt.pet.color;
      ctx.font = 'italic 14px "Inter", sans-serif';
      ctx.fillText(`Familiar: ${opt.pet.name} (${opt.pet.species})`, x + cardW / 2, cardY + 210);

      // Description - Centered within the card
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      this.wrapText(ctx, opt.description, x + cardW / 2, cardY + 238, cardW - 36, 18);

      // Base Stats
      const statY = cardY + 312;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Technique (TEC): ${opt.baseStats.technique}`, x + 25, statY);
      ctx.fillText(`Tone Quality (TON): ${opt.baseStats.toneQuality}`, x + 25, statY + 20);
      ctx.fillText(`Tempo Stability (TEM): ${opt.baseStats.tempoStability}`, x + 25, statY + 40);
      ctx.fillText(`Sight-Reading (RDG): ${opt.baseStats.sightReading}`, x + 25, statY + 60);

      // Choose Button Prompt
      ctx.textAlign = 'center';
      ctx.fillStyle = opt.pet.color;
      ctx.beginPath();
      ctx.roundRect(x + 20, cardY + cardH - 48, cardW - 40, 34, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Press [${idx + 1}] or Click`, x + cardW / 2, cardY + cardH - 31);
      ctx.textBaseline = 'alphabetic';
    });

    ctx.textAlign = 'center';
  }

  /* ---------------- PRACTICE SHED RHYTHM HIGHWAY ---------------- */

  private renderPracticeShed(state: GameState): void {
    const ctx = this.ctx;
    const session = state.practiceSession;
    if (!session) return;

    // Dimmed Music Studio Backdrop
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, this.width, this.height);

    // Header
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`PRACTICE SHED: ${session.type.toUpperCase().replace('_', ' ')} DRILL`, this.width / 2, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`BPM: ${session.bpm} | Time Remaining: ${Math.max(0, Math.ceil(session.duration - session.elapsedTime))}s`, this.width / 2, 80);

    // Rhythm Highway Container
    const hwX = 340;
    const hwY = 120;
    const hwW = 600;
    const hwH = 480;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(hwX, hwY, hwW, hwH, 16);
    ctx.fill();
    ctx.stroke();

    // 4 Lanes
    const laneW = hwW / 4;
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hwX + (i + 1) * laneW, hwY);
      ctx.lineTo(hwX + (i + 1) * laneW, hwY + hwH);
      ctx.stroke();

      // Key prompts at bottom
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      const keyName = i === 0 ? '1 / D' : (i === 1 ? '2 / F' : (i === 2 ? '3 / J' : '4 / K'));
      ctx.fillText(keyName, hwX + i * laneW + laneW / 2, hwY + hwH - 20);
    }

    // Target Hit Line (at Y: hwY + hwH - 70)
    const targetY = hwY + hwH - 70;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fillRect(hwX, targetY - 15, hwW, 30);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hwX, targetY);
    ctx.lineTo(hwX + hwW, targetY);
    ctx.stroke();

    // Draw Falling Notes
    const pixelsPerSecond = 240;
    for (const note of session.notes) {
      if (note.hit) continue;
      const timeDiff = note.targetTime - session.elapsedTime;
      const noteY = targetY - timeDiff * pixelsPerSecond;

      if (noteY >= hwY && noteY <= hwY + hwH) {
        const noteX = hwX + note.lane * laneW + laneW / 2;
        ctx.fillStyle = note.missed ? '#ef4444' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(noteX, noteY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Left Panel: Stats & Combo
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${Math.floor(session.score)}`, 80, 200);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`Combo: ${session.combo}x`, 80, 240);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`Max Combo: ${session.maxCombo}x`, 80, 280);

    // Feedback popup
    if (session.feedbackTimer > 0) {
      ctx.fillStyle = session.feedbackText.includes('PERFECT') ? '#eab308' : (session.feedbackText.includes('MISS') ? '#ef4444' : '#38bdf8');
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(session.feedbackText, this.width / 2, hwY + hwH / 2);
    }
  }

  /* ---------------- AUDITION BATTLE STAGE ---------------- */

  private renderAuditionBattle(state: GameState): void {
    const ctx = this.ctx;
    const battle = state.auditionBattle;
    if (!battle) return;

    // Stage Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, this.width, this.height);

    // Spotlight glow
    const grad = ctx.createRadialGradient(this.width / 2, 300, 50, this.width / 2, 300, 500);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️ AUDITION DUEL: HARMONIC JAM SESSION 🎻', this.width / 2, 45);

    // Subtitle / Mechanics Hint
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Inter", sans-serif';
    ctx.fillText('Duel Objective: Build your Harmony Composure to 100% with tactical phrases before opponent overwhelms the acoustic space!', this.width / 2, 72);

    // Left: Player & Familiar
    const player = state.ensemble.members[0];
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${player.name} (${player.instrumentName})`, 100, 120);
    this.drawPixelMusician(ctx, 180, 260, player, state.time, state.customization, 'right');
    this.drawPixelPet(ctx, 280, 280, player.pet, state.time, state.customization?.petTint, 'right');

    // Player Harmony Meter (Health/Composure to 100% win)
    this.drawBar(ctx, 100, 140, 300, 24, battle.playerHarmonyMeter, 100, '#38bdf8', '🎵 Harmony Composure: ' + battle.playerHarmonyMeter + '%');
    // Harmony Action Points (AP)
    this.drawBar(ctx, 100, 175, 300, 16, battle.harmonyPoints, battle.maxHarmonyPoints, '#fbbf24', '⚡ Energy (AP): ' + battle.harmonyPoints + ' / ' + battle.maxHarmonyPoints);

    // Stance Badges
    if (battle.playerStance !== 'normal') {
      ctx.fillStyle = battle.playerStance === 'pianissimo_shield' ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(`🛡️ [STANCE: ${battle.playerStance.toUpperCase().replace('_', ' ')}]`, 100, 205);
    }

    // Right: Opponent & Familiar
    const opp = battle.opponent;
    ctx.fillStyle = opp.paletteColor;
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${opp.name} (${opp.instrumentName})`, this.width - 100, 120);
    this.drawPixelMusician(ctx, this.width - 240, 260, opp, state.time, undefined, 'left');
    this.drawPixelPet(ctx, this.width - 340, 280, opp.pet, state.time, undefined, 'left');

    // Opponent Resonance Meter (Their Composure to 100% loss)
    this.drawBar(ctx, this.width - 400, 140, 300, 24, battle.opponentHarmonyMeter, 100, opp.paletteColor, '🎻 Rival Resonance: ' + battle.opponentHarmonyMeter + '%');

    if (battle.opponentStance !== 'normal') {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(`⚠️ [STANCE: ${battle.opponentStance.toUpperCase().replace('_', ' ')}]`, this.width - 400, 205);
    }

    // Middle: Battle Move Action Bar (4 Tactical Actions matching player's actual instrument)
    const moves = getBattleMovesForMusician(player);
    const moveW = 250;
    const moveH = 68;
    const moveStartX = (this.width - (moveW * 4 + 45)) / 2;
    const moveY = 475;

    let hoveredMove: any = null;
    let hoveredIdx = -1;

    moves.forEach((m, idx) => {
      const mx = moveStartX + idx * (moveW + 15);
      const isHovered = this.mousePos.x >= mx && this.mousePos.x <= mx + moveW &&
                        this.mousePos.y >= moveY && this.mousePos.y <= moveY + moveH;
      if (isHovered) {
        hoveredMove = m;
        hoveredIdx = idx;
      }

      const isAffordable = battle.harmonyPoints >= m.harmonyCost;
      ctx.fillStyle = isHovered ? 'rgba(30, 58, 138, 0.95)' : (isAffordable ? '#1e293b' : 'rgba(30, 41, 59, 0.4)');
      ctx.strokeStyle = isHovered ? '#fef08a' : (idx >= 2 ? (idx === 2 ? '#10b981' : '#f59e0b') : (isAffordable ? '#38bdf8' : '#64748b'));
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.beginPath();
      ctx.roundRect(mx, moveY, moveW, moveH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isAffordable ? '#f8fafc' : '#64748b';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${idx + 1}] ${m.name}`, mx + 14, moveY + 28);

      // Clean, uncrowded stat badge
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px "Inter", sans-serif';
      let tag = `Cost: ${m.harmonyCost} HP | Power: +${m.power}%`;
      if (m.effect === 'pianissimo_shield') tag = `Cost: ${m.harmonyCost} HP | +25 HP / 50% Guard`;
      if (m.effect === 'fortissimo_surge') tag = `Cost: ${m.harmonyCost} HP | 2x Power Surge`;
      ctx.fillText(tag, mx + 14, moveY + 50);
    });

    // Floating Tactical Hover Tooltip Box (Right above action buttons)
    if (hoveredMove) {
      const tipW = 760;
      const tipH = 70;
      const tipX = (this.width - tipW) / 2;
      const tipY = 385;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.97)';
      ctx.strokeStyle = hoveredIdx >= 2 ? (hoveredIdx === 2 ? '#10b981' : '#f59e0b') : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, tipH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`💡 TECHNIQUE DETAILS: ${hoveredMove.name.toUpperCase()}`, tipX + 18, tipY + 24);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillText(hoveredMove.description, tipX + 18, tipY + 48);
    } else {
      // Gentle hint when not hovering
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💡 Hover over any technique card to inspect tactical properties and mechanics.', this.width / 2, 425);
    }

    // Battle Log
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, 560, this.width - 200, 135, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    battle.log.slice(-4).forEach((logText, lIdx) => {
      ctx.fillText(`• ${logText}`, 120, 590 + lIdx * 26);
    });
  }

  /* ---------------- CONCERT COMPETITION ARENA ---------------- */

  private renderConcertCompetition(state: GameState): void {
    const ctx = this.ctx;
    const comp = state.competition;
    if (!comp) return;

    // Concert Hall Red Velvet Backdrop & Proscenium Stage
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#1c0512');
    bgGrad.addColorStop(1, '#3b0d23');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 CONCERT COMPETITION: VS ${comp.rival.name.toUpperCase()}`, this.width / 2, 50);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`Piece: "${comp.playerPiece.title}" (${comp.playerPiece.genre} • ${comp.playerPiece.bpm || 120} BPM)`, this.width / 2, 80);

    // Audience Applause & Tug-of-War Gauge
    const barW = 420;
    const barH = 14;
    const barX = this.width / 2 - barW / 2;
    const barY = 100;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 7);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const applauseFill = (comp.audienceApplause / 100) * barW;
    const appGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
    appGrad.addColorStop(0, '#f43f5e'); // Rival side
    appGrad.addColorStop(0.5, '#fbbf24');
    appGrad.addColorStop(1, '#38bdf8'); // Player side
    ctx.fillStyle = appGrad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(8, applauseFill), barH, 7);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText(`Audience Favor: ${comp.audienceApplause}%  |  Measure ${comp.currentMeasure} / ${comp.totalMeasures}`, this.width / 2, 130);

    // Left Stage: Player's Ensemble
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Your Ensemble (Score: ${comp.playerScore})`, 100, 165);

    state.ensemble.members.forEach((m, idx) => {
      this.drawPixelMusician(ctx, 120 + idx * 75, 260, m, state.time, idx === 0 ? state.customization : undefined, 'right');
      this.drawPixelPet(ctx, 140 + idx * 75, 300, m.pet, state.time, idx === 0 ? state.customization?.petTint : undefined, 'right');
    });

    // Right Stage: Rival Ensemble
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${comp.rival.name} (Score: ${comp.rivalScore})`, this.width - 100, 165);

    comp.rival.members.forEach((m, idx) => {
      this.drawPixelMusician(ctx, this.width - 180 - idx * 75, 260, m, state.time, undefined, 'left');
      this.drawPixelPet(ctx, this.width - 200 - idx * 75, 300, m.pet, state.time, undefined, 'left');
    });

    // 🎵 DYNAMIC RHYTHMIC CADENCE METER
    const meterW = 540;
    const meterH = 26;
    const meterX = this.width / 2 - meterW / 2;
    const meterY = this.height - 130;

    // Track Housing
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(meterX - 10, meterY - 36, meterW + 20, meterH + 52, 14);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Meter Background Groove
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(meterX, meterY, meterW, meterH, 6);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Golden Harmonic Sweet Spot Zone
    const sweetCenter = comp.sweetSpotCenter || 0.5;
    const sweetW = (comp.sweetSpotWidth || 0.16) * meterW;
    const sweetX = meterX + sweetCenter * meterW - sweetW / 2;

    const sweetGrad = ctx.createLinearGradient(sweetX, meterY, sweetX + sweetW, meterY);
    sweetGrad.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
    sweetGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.85)');
    sweetGrad.addColorStop(1, 'rgba(234, 179, 8, 0.3)');
    ctx.fillStyle = sweetGrad;
    ctx.fillRect(sweetX, meterY, sweetW, meterH);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(sweetX, meterY, sweetW, meterH);

    // Sweet Spot Label
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HARMONIC SWEET SPOT', sweetX + sweetW / 2, meterY + 17);

    // Sweeping Metronome Needle
    const tempoBPM = comp.playerPiece.bpm || 120;
    const sweep = Math.abs(((state.time * (tempoBPM / 60) * 0.8) % 2) - 1);
    const needleX = meterX + sweep * meterW;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(needleX, meterY - 8);
    ctx.lineTo(needleX, meterY + meterH + 8);
    ctx.stroke();

    // Needle Cursor Diamond
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(needleX, meterY - 12);
    ctx.lineTo(needleX + 6, meterY - 6);
    ctx.lineTo(needleX - 6, meterY - 6);
    ctx.closePath();
    ctx.fill();

    // Feedback Text & Streak
    if (comp.lastFeedbackText) {
      const isGood = comp.lastFeedback === 'PERFECT' || comp.lastFeedback === 'GREAT';
      ctx.fillStyle = isGood ? '#fef08a' : (comp.lastFeedback === 'OK' ? '#fde047' : '#fca5a5');
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const streakStr = comp.comboStreak > 1 ? ` (Streak: ${comp.comboStreak}🔥)` : '';
      ctx.fillText(`${comp.lastFeedbackText}${streakStr}`, this.width / 2, meterY - 14);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎵 Watch the Metronome Tempo Needle!', this.width / 2, meterY - 14);
    }

    // Action Prompt
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⏱️ Press [SPACE] when the Metronome Needle enters the Golden Zone!', this.width / 2, this.height - 35);
  }

  /* ---------------- WORLD OVERWORLD MAP ---------------- */

  private renderWorldMap(state: GameState): void {
    const ctx = this.ctx;
    const zone = WORLD_ZONES[state.currentZone];
    if (!zone) return;

    const camX = state.camera.x;
    const camY = state.camera.y;

    // 1. Rich Layered 2.5D Terrain Base
    if (state.currentZone === 'woodwind_woods' || state.currentZone === 'east_wilderness') {
      ctx.fillStyle = '#064e3b'; // Deep emerald forest base
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#047857'; // Lush foliage underlayer
    } else if (state.currentZone === 'brass_citadel' || state.currentZone === 'north_wilderness') {
      ctx.fillStyle = '#451a03'; // Warm stone base
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#78350f'; // Gilded terracotta tiles
    } else if (state.currentZone === 'percussion_peaks' || state.currentZone === 'south_wilderness') {
      ctx.fillStyle = '#1e1b4b'; // Deep amethyst caldera base
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#3b0764'; // Volcanic basalt
    } else if (state.currentZone === 'grand_hall') {
      ctx.fillStyle = '#0f172a'; // Deep slate velvet foundation
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#1e293b'; // Polished parquet wood flooring
    } else {
      // Cavatina Village & West Wilderness (Vibrant Meadow)
      ctx.fillStyle = '#064e3b'; // Deep woodland edge
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#047857'; // Lush grass lawn
    }

    // Grid Shading / Subtle Elevation Depth
    const tileSize = 64;
    const startTileX = Math.floor(camX / tileSize) * tileSize;
    const startTileY = Math.floor(camY / tileSize) * tileSize;
    const endTileX = startTileX + this.width + tileSize * 2;
    const endTileY = startTileY + this.height + tileSize * 2;

    for (let gx = startTileX; gx < endTileX; gx += tileSize) {
      for (let gy = startTileY; gy < endTileY; gy += tileSize) {
        if (gx < 0 || gx >= zone.width || gy < 0 || gy >= zone.height) continue;
        const screenX = gx - camX;
        const screenY = gy - camY;

        // Pseudo-random deterministic hash for environmental details
        const seed = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
        const hash = seed - Math.floor(seed);

        if (state.currentZone === 'grand_hall') {
          // Indoor Parquet Wood Panels
          ctx.fillStyle = (Math.floor(gx / tileSize) + Math.floor(gy / tileSize)) % 2 === 0 ? '#1e293b' : '#334155';
          ctx.fillRect(screenX, screenY, tileSize - 1, tileSize - 1);
        } else {
          // Outdoor Grass Variation
          ctx.fillStyle = hash > 0.5 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(5, 150, 105, 0.04)';
          ctx.fillRect(screenX, screenY, tileSize, tileSize);

          // Wildflowers, Clover, and Grass Tufts in Cavatina and Woods
          if (hash > 0.82 && (state.currentZone === 'cavatina_village' || state.currentZone === 'woodwind_woods')) {
            // Blooming Wildflowers
            ctx.fillStyle = hash > 0.94 ? '#f43f5e' : (hash > 0.88 ? '#fbbf24' : '#38bdf8');
            ctx.beginPath();
            ctx.arc(screenX + 18, screenY + 22, 3, 0, Math.PI * 2);
            ctx.arc(screenX + 24, screenY + 26, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Tiny green stem
            ctx.fillStyle = '#10b981';
            ctx.fillRect(screenX + 17, screenY + 25, 2, 4);
          } else if (hash > 0.70 && hash <= 0.82) {
            // Grass Tufts
            ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
            ctx.fillRect(screenX + 30, screenY + 34, 2, 6);
            ctx.fillRect(screenX + 33, screenY + 32, 2, 8);
            ctx.fillRect(screenX + 36, screenY + 35, 2, 5);
          } else if (hash < 0.12 && state.currentZone === 'percussion_peaks') {
            // Basalt Pebbles
            ctx.fillStyle = '#4c1d95';
            ctx.beginPath();
            ctx.arc(screenX + 20, screenY + 30, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 2. Zone-Specific Pathways (Audited & Aligned; No Dead Ends)
    if (state.currentZone === 'cavatina_village') {
      const px = 1000 - camX;
      const py = 720 - camY;
      const r = 160;

      // Solid Slate Cobblestone Plaza
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();

      // East Promenade: Straight from Central Plaza to East Gate (No dead ends!)
      ctx.fillRect(1000 - camX, 840 - camY, 1000, 120);

      // Northwest Walkway to Academy & Forge
      ctx.beginPath();
      ctx.moveTo(920 - camX, 640 - camY);
      ctx.lineTo(380 - camX, 500 - camY);
      ctx.lineTo(730 - camX, 500 - camY);
      ctx.lineTo(980 - camX, 600 - camY);
      ctx.closePath();
      ctx.fill();

      // Southwest Walkway to Melodic Rose Tavern
      ctx.beginPath();
      ctx.moveTo(920 - camX, 800 - camY);
      ctx.lineTo(540 - camX, 1180 - camY);
      ctx.lineTo(620 - camX, 1220 - camY);
      ctx.lineTo(980 - camX, 840 - camY);
      ctx.closePath();
      ctx.fill();

      // Northeast Walkway to Conservatory Library
      ctx.beginPath();
      ctx.moveTo(1080 - camX, 640 - camY);
      ctx.lineTo(1370 - camX, 500 - camY);
      ctx.lineTo(1450 - camX, 540 - camY);
      ctx.lineTo(1020 - camX, 600 - camY);
      ctx.closePath();
      ctx.fill();

      // Southeast Walkway to Town Hall & Clocktower
      ctx.beginPath();
      ctx.moveTo(1080 - camX, 800 - camY);
      ctx.lineTo(1400 - camX, 1180 - camY);
      ctx.lineTo(1480 - camX, 1220 - camY);
      ctx.lineTo(1020 - camX, 840 - camY);
      ctx.closePath();
      ctx.fill();

      // Plaza Concentric Pavers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 120, 0, Math.PI * 2);
      ctx.stroke();

      // East Road Curbs
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1000 - camX, 840 - camY);
      ctx.lineTo(2000 - camX, 840 - camY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1000 - camX, 960 - camY);
      ctx.lineTo(2000 - camX, 960 - camY);
      ctx.stroke();

    } else if (state.currentZone === 'woodwind_woods') {
      // Meandering Forest Trail connecting West Gate (x:0, y:900) to Central Plaza & Buildings
      ctx.fillStyle = 'rgba(120, 53, 15, 0.35)'; // Earthy dirt path
      ctx.beginPath();
      ctx.moveTo(0 - camX, 840 - camY);
      ctx.lineTo(1000 - camX, 720 - camY);
      ctx.lineTo(1400 - camX, 1180 - camY);
      ctx.lineTo(1370 - camX, 500 - camY);
      ctx.lineTo(730 - camX, 500 - camY);
      ctx.lineTo(380 - camX, 500 - camY);
      ctx.lineTo(0 - camX, 960 - camY);
      ctx.closePath();
      ctx.fill();

    } else if (state.currentZone === 'brass_citadel') {
      // Grand Gilded Concourse connecting South Gate (y:1600, x:920-1080) to Central Plaza & Buildings
      ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.fillRect(920 - camX, 600 - camY, 160, 1000);
      ctx.fillRect(380 - camX, 500 - camY, 1200, 120);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(914 - camX, 600 - camY, 6, 1000);
      ctx.fillRect(1080 - camX, 600 - camY, 6, 1000);

    } else if (state.currentZone === 'percussion_peaks') {
      // Mountain Stone Pass connecting North Gate (y:0, x:920-1080) to Central Plaza & Buildings
      ctx.fillStyle = 'rgba(139, 92, 246, 0.28)';
      ctx.fillRect(920 - camX, 0 - camY, 160, 800);
      ctx.fillRect(380 - camX, 500 - camY, 1200, 120);
      ctx.fillRect(380 - camX, 1150 - camY, 1200, 120);
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(914 - camX, 0 - camY, 6, 800);
      ctx.fillRect(1080 - camX, 0 - camY, 6, 800);

    } else if (state.currentZone === 'grand_hall') {
      // Central City Grand Velvet Cross-Concourse
      ctx.fillStyle = '#991b1b'; // Velvet runner
      // Vertical runner (North Gate y:0 to South Gate y:2000)
      ctx.fillRect(1120 - camX, 0 - camY, 160, 2000);
      // Horizontal runner (West Arch x:0 to East Gate x:2400)
      ctx.fillRect(0 - camX, 920 - camY, 2400, 160);
      // Central Plaza Dais Paving
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(1200 - camX, 1140 - camY, 160, 0, Math.PI * 2);
      ctx.fill();

      // Gold Braided Fringe
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(1114 - camX, 0 - camY, 6, 2000);
      ctx.fillRect(1280 - camX, 0 - camY, 6, 2000);
      ctx.fillRect(0 - camX, 914 - camY, 2400, 6);
      ctx.fillRect(0 - camX, 1080 - camY, 2400, 6);

    } else if (state.currentZone === 'west_wilderness' || state.currentZone === 'east_wilderness') {
      // Short E/W Traversal Highway (width: 800) + N/S Exploration Trails (height: 1800)
      ctx.fillStyle = 'rgba(180, 83, 9, 0.28)';
      ctx.fillRect(0 - camX, 840 - camY, 800, 120); // Direct highway
      ctx.fillRect(350 - camX, 200 - camY, 100, 1400); // Deep North/South exploration path
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0 - camX, 840 - camY, 800, 120);

    } else if (state.currentZone === 'north_wilderness' || state.currentZone === 'south_wilderness') {
      // Short N/S Traversal Highway (height: 800) + E/W Exploration Trails (width: 1800)
      ctx.fillStyle = 'rgba(180, 83, 9, 0.28)';
      ctx.fillRect(840 - camX, 0 - camY, 120, 800); // Direct highway
      ctx.fillRect(200 - camX, 350 - camY, 1400, 100); // Deep East/West exploration path
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(840 - camX, 0 - camY, 120, 800);
    }

    // 3. Draw Transitions (Ground Exit Thresholds - Clean, non-intrusive road markings)
    for (const tr of zone.transitions) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(tr.bounds.x - camX, tr.bounds.y - camY, tr.bounds.w, tr.bounds.h);
      ctx.restore();
    }

    // 4. Depth-Sorted Scene Queue (Prevents entities clipping through building roofs)
    interface DioramaEntity {
      depthY: number;
      draw: () => void;
    }
    const sceneQueue: DioramaEntity[] = [];

    // Obstacles (Buildings, Gates, Fountains, Willows, Pillars)
    for (const obs of zone.obstacles) {
      const bottomY = obs.type === 'circle' ? obs.y + (obs.radius || 0) : obs.y + (obs.h || 0);
      sceneQueue.push({
        depthY: bottomY,
        draw: () => {
          if (obs.type === 'building') {
            this.drawBuilding(ctx, obs, camX, camY, state.time);
          } else if (obs.type === 'gate' || obs.type === 'arch' || obs.buildingType === 'bridge') {
            this.drawGate(ctx, obs, camX, camY);
          } else if (obs.type === 'box' && obs.w && obs.h) {
            ctx.fillStyle = state.currentZone === 'woodwind_woods' ? '#064e3b' : '#1e293b';
            ctx.strokeStyle = state.currentZone === 'woodwind_woods' ? '#047857' : '#475569';
            ctx.lineWidth = 2;
            ctx.fillRect(obs.x - camX, obs.y - camY, obs.w, obs.h);
            ctx.strokeRect(obs.x - camX, obs.y - camY, obs.w, obs.h);
          } else if (obs.type === 'circle' && obs.radius) {
            this.drawCircularObstacle(ctx, obs, camX, camY, state.time);
          }
        }
      });
    }

    // NPCs & Harmonipets
    for (const npc of state.npcs) {
      if (npc.zone === state.currentZone) {
        sceneQueue.push({
          depthY: npc.y,
          draw: () => this.drawNPCEntity(ctx, npc, camX, camY, state.time)
        });
      }
    }

    // Player & Active Pet
    if (state.ensemble.members.length > 0) {
      sceneQueue.push({
        depthY: state.player.y,
        draw: () => this.drawPlayerEntity(ctx, state, camX, camY)
      });
    }

    // Sort by depthY ascending and execute draw
    sceneQueue.sort((a, b) => a.depthY - b.depthY);
    for (const entity of sceneQueue) {
      entity.draw();
    }

    // 7. Proximity Action Prompt
    if (state.nearbyInteractable) {
      const target = state.nearbyInteractable;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 220, this.height - 85, 440, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(target.title, this.width / 2, this.height - 58);
    }
  }

  private drawCircularObstacle(ctx: CanvasRenderingContext2D, obs: WorldObstacle, camX: number, camY: number, t: number): void {
    const fx = obs.x - camX;
    const fy = obs.y - camY;
    const r = obs.radius || 40;
    const obsName = obs.name || '';

    if (obsName.includes('Fountain')) {
      // ⛲ Clef Fountain Pond (Cavatina Plaza)
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.arc(fx, fy, r + 16, 0, Math.PI * 2);
      ctx.fill();

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        const flx = fx + Math.cos(a) * (r + 10);
        const fly = fy + Math.sin(a) * (r + 10);
        ctx.fillStyle = (Math.floor(a * 10) % 2 === 0) ? '#f43f5e' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(flx, fly, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, fy, r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(fx, fy, r, 0, Math.PI * 2);
      ctx.fill();

      const rip1 = (t * 18) % r;
      const rip2 = (t * 18 + r * 0.5) % r;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, fy, rip1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fx, fy, rip2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 38px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('𝄞', fx, fy + 14);

    } else if (obsName.includes('Willow') || obsName.includes('Grove')) {
      // 🌳 Ancient Resonant Willow / Piccolo Grove
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(fx + 8, fy + r - 4, r * 1.1, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#451a03';
      ctx.fillRect(fx - 14, fy - 10, 28, r + 10);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(fx - 10, fy - 8, 20, r + 8);

      const sway = Math.sin(t * 2 + fx * 0.01) * 4;
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.arc(fx + sway, fy - 22, r + 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(fx - 12 + sway, fy - 28, r - 4, 0, Math.PI * 2);
      ctx.arc(fx + 14 + sway, fy - 26, r - 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(fx + sway, fy - 36, r - 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(fx + i * 16 + sway, fy - 10);
        ctx.quadraticCurveTo(fx + i * 18 + sway + Math.sin(t * 3 + i) * 6, fy + 20, fx + i * 12 + sway, fy + 35);
        ctx.stroke();
      }

    } else if (obsName.includes('Pillar')) {
      // 🏛️ Gilded Herald Pillar (Brass Citadel)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(fx + 6, fy + r - 4, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(fx - 18, fy - 60, 36, r + 60);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.strokeRect(fx - 18, fy - 60, 36, r + 60);

      ctx.fillStyle = '#eab308';
      ctx.fillRect(fx - 24, fy - 70, 48, 12);
      ctx.fillRect(fx - 24, fy + r - 8, 48, 12);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎺', fx, fy - 25);

    } else if (obsName.includes('Monolith')) {
      // 🪨 Basalt Sonic Monolith (Percussion Peaks)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(fx + 8, fy + r - 6, r * 1.1, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(fx - 24, fy + r);
      ctx.lineTo(fx - 18, fy - 70);
      ctx.lineTo(fx, fy - 95);
      ctx.lineTo(fx + 18, fy - 70);
      ctx.lineTo(fx + 24, fy + r);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#6b21a8';
      ctx.lineWidth = 2;
      ctx.stroke();

      const pulse = 0.5 + Math.sin(t * 3.5 + fx) * 0.5;
      ctx.fillStyle = `rgba(216, 180, 254, ${0.4 + pulse * 0.6})`;
      ctx.font = 'bold 18px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥁', fx, fy - 35);
      ctx.font = 'bold 12px "Cinzel", serif';
      ctx.fillText('𝄢 𝄡', fx, fy - 10);
    }
  }

  private drawNPCEntity(ctx: CanvasRenderingContext2D, npc: WorldNPC, camX: number, camY: number, t: number): void {
    const nx = npc.x - camX;
    const ny = npc.y - camY;

    if (npc.musicianData) {
      this.drawPixelMusician(ctx, nx, ny, npc.musicianData, t, undefined, npc.dir || 'down');
      if (npc.musicianData.pet) {
        this.drawPixelPet(ctx, nx + 24, ny + 4, npc.musicianData.pet, t, undefined, npc.dir || 'down');
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(nx - 45, ny - 38, 90, 20, 4);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, nx, ny - 24);

    } else if (npc.actionType === 'wild_harmonipet' && npc.wildPetData) {
      this.drawPixelPet(ctx, nx, ny, npc.wildPetData, t, undefined, npc.dir || 'down');
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(nx - 50, ny - 34, 100, 20, 4);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`✨ ${npc.wildPetData.name}`, nx, ny - 20);

    } else if (npc.isProp || npc.actionType === 'sheet_music_stand' || npc.actionType === 'signpost' || npc.actionType === 'inspiration_vista' || npc.actionType === 'practice_bench' || npc.actionType === 'theory_bench' || npc.actionType === 'customization_mirror') {
      let pType = npc.propType || 'music_stand';
      if (npc.actionType === 'inspiration_vista') pType = 'vista_monolith';
      if (npc.name.includes('Ancient')) pType = 'ancient_stone_stand';
      if (npc.name.includes('Golden')) pType = 'golden_music_stand';
      this.drawProp(ctx, nx, ny, pType, t, npc);

    } else {
      this.drawPixelMusician(ctx, nx, ny, {
        id: npc.id,
        name: npc.name,
        title: npc.title,
        avatar: '👤',
        paletteColor: '#0284c7',
        instrumentId: 'violin',
        instrumentName: 'Acoustic Instrument',
        section: 'strings',
        stats: { technique: 10, toneQuality: 10, tempoStability: 10, sightReading: 10 },
        level: 1,
        xp: 0
      } as any, t);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(nx - 45, ny - 38, 90, 20, 4);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, nx, ny - 24);
    }

    // Floating Dynamic Speech / Banter Bubble
    if (npc.chatBubble) {
      const bText = npc.chatBubble.text;
      ctx.font = 'bold 11px "Inter", sans-serif';
      const textW = Math.min(ctx.measureText(bText).width + 16, 170);
      const bH = 22;
      const bX = nx;
      const bY = ny - 64;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bX - textW / 2, bY, textW, bH, 6);
      ctx.fill();
      ctx.stroke();

      // Tail pointing to speaker
      ctx.beginPath();
      ctx.moveTo(bX - 4, bY + bH);
      ctx.lineTo(bX, bY + bH + 5);
      ctx.lineTo(bX + 4, bY + bH);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(bText, bX, bY + 15);
    }
  }

  private drawPlayerEntity(ctx: CanvasRenderingContext2D, state: GameState, camX: number, camY: number): void {
    const px = state.player.x - camX;
    const py = state.player.y - camY;
    const player = state.ensemble.members[0];
    if (!player) return;

    this.drawPixelMusician(ctx, px, py, player, state.time, state.customization, state.player.dir);

    let petX = px + 22;
    let petY = py + 4;
    if (state.player.dir === 'left') { petX = px + 24; petY = py + 2; }
    else if (state.player.dir === 'right') { petX = px - 24; petY = py + 2; }
    else if (state.player.dir === 'up') { petX = px + 18; petY = py + 18; }
    else if (state.player.dir === 'down') { petX = px + 20; petY = py - 16; }

    this.drawPixelPet(ctx, petX, petY, player.pet, state.time, state.customization?.petTint, state.player.dir);
  }

  /* ---------------- HUD OVERLAY ---------------- */

  private renderHUD(state: GameState): void {
    const ctx = this.ctx;
    const zone = WORLD_ZONES[state.currentZone];

    // Top Bar Container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(0, 0, this.width, 54);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 54);
    ctx.lineTo(this.width, 54);
    ctx.stroke();

    // Zone Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 ${zone ? zone.name : 'Sonora'}`, 24, 34);

    // Player Skill & Level Pill
    const player = state.ensemble.members[0];
    const avgSkill = player ? Math.round((player.stats.technique + player.stats.toneQuality + player.stats.tempoStability + player.stats.sightReading) / 4) : 10;
    const skillPillX = 210;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(skillPillX, 10, 205, 34, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`👤 Lv.${player?.level || 1} Maestro • Skill: ${avgSkill}`, skillPillX + 102, 32);

    // Ensemble Tier Badge
    const tierName = state.ensemble.tier.toUpperCase();
    const count = state.ensemble.members.length;
    const tierPillX = 430;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tierPillX, 10, 195, 34, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎼 [${tierName} • ${count} Musician${count > 1 ? 's' : ''}]`, tierPillX + 97, 32);

    // Currency Wallet & Reputation (Right aligned)
    const rep = state.ensemble.reputationStars || state.wallet.reputationStars || 0;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`★ Rep: ${rep}★  |  💰 ${state.wallet.gold} Notes  |  ✨ ${state.wallet.inspirationSparks} Sparks`, this.width - 24, 33);

    // Transient Onboarding Motion Helper (Only shown during first 8 seconds of play)
    if (state.time < 8) {
      const alpha = Math.min(1, (8 - state.time) / 2);
      ctx.fillStyle = `rgba(15, 23, 42, ${0.85 * alpha})`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(16, this.height - 48, 280, 32, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🎮 Move: [W A S D] or [↑ ← ↓ →]', 28, this.height - 27);
    }
  }

  /* ---------------- DIALOGUE OVERLAY ---------------- */

  private renderDialogue(state: GameState): void {
    const ctx = this.ctx;
    const dia = state.dialogue;
    if (!dia) return;

    const boxW = 860;
    const boxH = 150;
    const boxX = (this.width - boxW) / 2;
    const boxY = this.height - boxH - 30;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    // Avatar Box
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(boxX + 20, boxY + 25, 100, 100, 12);
    ctx.fill();
    ctx.font = '48px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dia.avatar, boxX + 70, boxY + 90);

    // Speaker Name
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(dia.speaker, boxX + 140, boxY + 45);

    // Text Lines
    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px "Inter", sans-serif';
    const currentText = dia.text[dia.index] || '';
    this.wrapText(ctx, currentText, boxX + 140, boxY + 75, boxW - 170, 24);

    // Advance Prompt
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 13px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Press [SPACE] to advance ▸', boxX + boxW - 20, boxY + boxH - 15);
  }

  /* ---------------- DETAILED PROCEDURAL BUILDINGS & GATES ---------------- */

  private drawBuilding(ctx: CanvasRenderingContext2D, obs: WorldObstacle, camX: number, camY: number, t: number): void {
    const bx = obs.x - camX;
    const by = obs.y - camY;
    const bw = obs.w || 200;
    const bh = obs.h || 150;
    const bType = obs.buildingType || 'cottage';

    if (bType === 'wall') {
      // Ancient Fortress Masonry Wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);
      // Stone block brickwork lines
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 1;
      for (let y = by + 16; y < by + bh; y += 16) {
        ctx.beginPath();
        ctx.moveTo(bx, y);
        ctx.lineTo(bx + bw, y);
        ctx.stroke();
      }
      return;
    }

    // 2.5D Building Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect(bx + 8, by + bh - 6, bw, 14, 6);
    ctx.fill();

    if (bType === 'academy') {
      // 🏛️ GRAND CONSERVATORY ACADEMY (Greco-Roman Classical Architecture)
      const roofH = 50;
      const wallY = by + roofH;
      const wallH = bh - roofH;

      // Base Wall (Polished Off-White Marble)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx, wallY, bw, wallH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, wallY, bw, wallH);

      // Triangular Pediment (Gable)
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(bx - 10, wallY);
      ctx.lineTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw + 10, wallY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Golden Lyre Emblem in Pediment
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('𝄞', bx + bw / 2, wallY - 12);

      // 4 Grand Classical Fluted Columns
      const colW = 16;
      const colSpacing = (bw - colW * 4) / 5;
      for (let i = 0; i < 4; i++) {
        const cx = bx + colSpacing + i * (colW + colSpacing);
        // Column Capital
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 3, wallY, colW + 6, 6);
        // Column Shaft
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx, wallY + 6, colW, wallH - 12);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, wallY + 6, colW, wallH - 12);
        // Base
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 3, by + bh - 6, colW + 6, 6);
      }

      // Grand Arched Double Doors
      const doorW = 44;
      const doorH = 56;
      const doorX = bx + bw / 2 - doorW / 2;
      const doorY = by + bh - doorH;
      ctx.fillStyle = '#1e3a8a'; // Royal Blue conservatory doors
      ctx.beginPath();
      ctx.roundRect(doorX, doorY, doorW, doorH, [22, 22, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Welcome Entrance Step
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(doorX - 4, by + bh - 4, doorW + 8, 5);

      // Hanging Brass Sign
      this.drawBuildingSign(ctx, bx + 24, wallY + 20, '🎼');

    } else if (bType === 'forge') {
      // 🎻 MASTER LUTHIER'S FORGE & WORKSHOP (Rustic Stone & Timber)
      const roofH = 55;
      const wallY = by + roofH;
      const wallH = bh - roofH;

      // Stone Foundation & Timber Wall
      ctx.fillStyle = '#475569'; // Slate masonry
      ctx.fillRect(bx, wallY + wallH * 0.4, bw, wallH * 0.6);
      ctx.fillStyle = '#b45309'; // Warm amber timber
      ctx.fillRect(bx, wallY, bw, wallH * 0.4);

      // Heavy Timber Beams
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx, wallY, bw, 6);
      ctx.fillRect(bx, wallY + wallH * 0.4, bw, 6);
      ctx.fillRect(bx, by + bh - 6, bw, 6);
      ctx.fillRect(bx, wallY, 8, wallH);
      ctx.fillRect(bx + bw - 8, wallY, 8, wallH);

      // Terracotta Shingled Roof
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(bx - 12, wallY);
      ctx.lineTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw + 12, wallY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Blacksmith & Kiln Chimney with Rising Ember Smoke
      const chimX = bx + bw - 36;
      const chimY = by - 16;
      ctx.fillStyle = '#334155';
      ctx.fillRect(chimX, chimY, 20, roofH + 16);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(chimX - 2, chimY, 24, 6);
      // Floating warm smoke puffs
      const sBob = (t * 22) % 36;
      ctx.fillStyle = 'rgba(251, 146, 60, 0.45)';
      ctx.beginPath();
      ctx.arc(chimX + 10 + Math.sin(t * 3) * 5, chimY - sBob, 6 + sBob * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Open Workshop Stall with Hung Violins
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx + 24, wallY + 16, bw * 0.4, wallH - 22);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 24, wallY + 16, bw * 0.4, wallH - 22);
      // Tiny hung violin bodies
      ctx.fillStyle = '#fbbf24';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText('🎻', bx + 36, wallY + 36);
      ctx.fillText('🎻', bx + 64, wallY + 36);

      // Heavy Workshop Door
      const doorW = 34;
      const doorH = 48;
      const doorX = bx + bw * 0.72 - doorW / 2;
      const doorY = by + bh - doorH;
      ctx.fillStyle = '#92400e';
      ctx.fillRect(doorX, doorY, doorW, doorH);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(doorX, doorY, doorW, doorH);

      // Welcome Entrance Step
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(doorX - 4, by + bh - 4, doorW + 8, 5);

      // Wrought Iron Anvil/Violin Sign
      this.drawBuildingSign(ctx, bx + bw - 24, wallY + 20, '⚒️');

    } else if (bType === 'library') {
      // 📖 CONSERVATORY ARCHIVE & LIBRARY (Domed Scholarly Tower)
      const roofH = 50;
      const wallY = by + roofH;
      const wallH = bh - roofH;

      // Ancient Sandstone Masonry
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx, wallY, bw, wallH);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, wallY, bw, wallH);

      // Domed Scholarly Roof
      ctx.fillStyle = '#065f46'; // Emerald Copper Dome
      ctx.beginPath();
      ctx.ellipse(bx + bw / 2, wallY, bw / 2 + 8, roofH, 0, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cupola / Weather Spire
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(bx + bw / 2 - 4, by - 16, 8, 20);
      ctx.beginPath();
      ctx.arc(bx + bw / 2, by - 16, 6, 0, Math.PI * 2);
      ctx.fill();

      // 3 High Arched Leaded Glass Windows (Candlelit)
      const winW = 22;
      const winH = 42;
      const spacing = (bw - winW * 3) / 4;
      for (let i = 0; i < 3; i++) {
        const wx = bx + spacing + i * (winW + spacing);
        ctx.fillStyle = '#fef08a'; // Golden candlelight glow
        ctx.beginPath();
        ctx.roundRect(wx, wallY + 16, winW, winH, [11, 11, 0, 0]);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Archway Entrance
      const doorW = 36;
      const doorH = 46;
      const doorX = bx + bw / 2 - doorW / 2;
      const doorY = by + bh - doorH;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(doorX, doorY, doorW, doorH, [18, 18, 0, 0]);
      ctx.fill();

      // Welcome Entrance Step
      ctx.fillStyle = '#10b981';
      ctx.fillRect(doorX - 4, by + bh - 4, doorW + 8, 5);

      // Open Book Crest Sign
      this.drawBuildingSign(ctx, bx + 24, wallY + 20, '📖');

    } else if (bType === 'tavern') {
      // 🍺 THE MELODIC ROSE TAVERN & INN (Tudor Half-Timbered Gable)
      const roofH = 60;
      const wallY = by + roofH;
      const wallH = bh - roofH;

      // Cream Plaster & Dark Timber Beams
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx, wallY, bw, wallH);

      // Diagonal Tudor Timbers
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(bx, wallY); ctx.lineTo(bx + bw * 0.3, by + bh);
      ctx.moveTo(bx + bw, wallY); ctx.lineTo(bx + bw * 0.7, by + bh);
      ctx.stroke();

      // Boundary beams
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx, wallY, bw, 6);
      ctx.fillRect(bx, by + bh - 6, bw, 6);
      ctx.fillRect(bx, wallY, 8, wallH);
      ctx.fillRect(bx + bw - 8, wallY, 8, wallH);

      // Steep Gabled Shingle Roof
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(bx - 12, wallY);
      ctx.lineTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw + 12, wallY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glowing Warm Tavern Door
      const doorW = 34;
      const doorH = 46;
      const doorX = bx + bw / 2 - doorW / 2;
      const doorY = by + bh - doorH;
      ctx.fillStyle = '#92400e';
      ctx.fillRect(doorX, doorY, doorW, doorH);

      // Welcome Entrance Step
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(doorX - 4, by + bh - 4, doorW + 8, 5);

      // Hanging Lantern
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(doorX + doorW + 10, doorY + 14, 5, 0, Math.PI * 2);
      ctx.fill();

      // Outdoor Beer Barrels
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(bx + 26, by + bh - 14, 12, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Foaming Tankard & Lute Sign
      this.drawBuildingSign(ctx, bx + 24, wallY + 16, '🍺');

    } else if (bType === 'clocktower') {
      // ⏰ CAVATINA TOWN HALL & CLOCKTOWER (Stone Spire with Animated Clock)
      const towerW = bw * 0.45;
      const towerX = bx + bw / 2 - towerW / 2;

      // Base Hall Wings
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx, by + bh * 0.4, bw, bh * 0.6);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by + bh * 0.4, bw, bh * 0.6);

      // Central Stone Tower
      ctx.fillStyle = '#475569';
      ctx.fillRect(towerX, by + 10, towerW, bh - 10);
      ctx.strokeRect(towerX, by + 10, towerW, bh - 10);

      // Spire Roof
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.moveTo(towerX - 6, by + 10);
      ctx.lineTo(bx + bw / 2, by - 24);
      ctx.lineTo(towerX + towerW + 6, by + 10);
      ctx.closePath();
      ctx.fill();

      // Glowing Clock Face with Tempo Markings
      const clockR = 24;
      const clockY = by + 46;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(bx + bw / 2, clockY, clockR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Animated Clock Hands
      const handAngle = (t * 0.8) % (Math.PI * 2);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2, clockY);
      ctx.lineTo(bx + bw / 2 + Math.cos(handAngle) * 16, clockY + Math.sin(handAngle) * 16);
      ctx.moveTo(bx + bw / 2, clockY);
      ctx.lineTo(bx + bw / 2 + Math.cos(handAngle * 0.1) * 10, clockY + Math.sin(handAngle * 0.1) * 10);
      ctx.stroke();

      // Grand Arch Portal
      const doorW = 36;
      const doorH = 46;
      const doorX = bx + bw / 2 - doorW / 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(doorX, by + bh - doorH, doorW, doorH, [18, 18, 0, 0]);
      ctx.fill();

      // Welcome Entrance Step
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(doorX - 4, by + bh - 4, doorW + 8, 5);

      // Tempo Sign
      this.drawBuildingSign(ctx, bx + 24, by + bh * 0.4 + 20, '⏰');

    } else {
      // 🏡 COZY GABLED COTTAGE
      const roofH = 50;
      const wallY = by + roofH;
      const wallH = bh - roofH;

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx, wallY, bw, wallH);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx, wallY, bw, 6);
      ctx.fillRect(bx, by + bh - 6, bw, 6);

      ctx.fillStyle = obs.roofColor || '#059669';
      ctx.beginPath();
      ctx.moveTo(bx - 8, wallY);
      ctx.lineTo(bx + bw / 2, by);
      ctx.lineTo(bx + bw + 8, wallY);
      ctx.closePath();
      ctx.fill();

      const doorW = 30;
      const doorH = 42;
      ctx.fillStyle = '#92400e';
      ctx.fillRect(bx + bw / 2 - doorW / 2, by + bh - doorH, doorW, doorH);

      // Window with flower box
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(bx + 20, wallY + 16, 24, 24);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(bx + 18, wallY + 38, 28, 6);
    }
  }

  private drawBuildingSign(ctx: CanvasRenderingContext2D, x: number, y: number, icon: string): void {
    // Wrought Iron Arm
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 2, y - 6, 4, 16);
    // Signboard
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 14, y + 8, 28, 28, 6);
    ctx.fill();
    ctx.stroke();
    // Icon
    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon, x, y + 28);
  }

  private drawGate(ctx: CanvasRenderingContext2D, obs: WorldObstacle, camX: number, camY: number): void {
    const gx = obs.x - camX;
    const gy = obs.y - camY;
    const gw = obs.w || 160;
    const gh = obs.h || 60;
    const isBridge = obs.buildingType === 'bridge';
    const isHorizontalRoad = gh > gw; // East/West gates (horizontal road passing through)

    if (isBridge) {
      // 🌉 Arched Stone Bridge across Melodic River
      // Cobblestone Bridge Deck
      ctx.fillStyle = '#334155';
      ctx.fillRect(gx + 20, gy, gw - 40, gh);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx + 20, gy, gw - 40, gh);

      // Stone Balustrades / Guard Rails
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gx + 12, gy, 8, gh);
      ctx.fillRect(gx + gw - 20, gy, 8, gh);

      // Ornamental Balustrade Finials
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(gx + 10, gy - 2, 12, 6);
      ctx.fillRect(gx + 10, gy + gh - 4, 12, 6);
      ctx.fillRect(gx + gw - 22, gy - 2, 12, 6);
      ctx.fillRect(gx + gw - 22, gy + gh - 4, 12, 6);
      return;
    }

    if (isHorizontalRoad) {
      // 🏛️ West / East Flanking Gateway Pillars (Road passes cleanly through the middle!)
      // Top Flanking Pillar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gx, gy, gw, 26);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx, gy, gw, 26);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(gx - 2, gy - 4, gw + 4, 6);

      // Bottom Flanking Pillar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gx, gy + gh - 26, gw, 26);
      ctx.strokeRect(gx, gy + gh - 26, gw, 26);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(gx - 2, gy + gh - 2, gw + 4, 6);

      // Classical Arch Overhead Archway / Sign Span
      const signW = 210;
      const signH = 34;
      const signX = gx + gw / 2 - signW / 2;
      const signY = gy + gh / 2 - signH / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(signX, signY, signW, signH, 8);
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const cleanName = obs.name ? obs.name.split('(')[0].trim() : 'Gateway';
      ctx.fillText(`${obs.signIcon || '🏛️'} ${cleanName}`, gx + gw / 2, signY + 22);

    } else {
      // 🏛️ North / South Gateway (Vertical Road passing through horizontal wall)
      // Left Flanking Gatepost
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gx, gy, 26, gh);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx, gy, 26, gh);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(gx - 4, gy - 2, 34, 6);

      // Right Flanking Gatepost
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gx + gw - 26, gy, 26, gh);
      ctx.strokeRect(gx + gw - 26, gy, 26, gh);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(gx + gw - 30, gy - 2, 34, 6);

      // Transom Arch Banner
      const signW = 220;
      const signH = 36;
      const signX = gx + gw / 2 - signW / 2;
      const signY = gy + gh / 2 - signH / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(signX, signY, signW, signH, 8);
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12.5px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const cleanName = obs.name ? obs.name.split('(')[0].trim() : 'Gateway';
      ctx.fillText(`${obs.signIcon || '🏛️'} ${cleanName}`, gx + gw / 2, signY + 23);
    }
  }

  private drawProp(ctx: CanvasRenderingContext2D, x: number, y: number, propType: string, t: number = 0, npc?: any): void {
    if (propType === 'ancient_stone_stand') {
      // 🪨 Ancient Moss-Covered Rune Altar & Stand
      ctx.fillStyle = '#334155'; // Dark granite monolith base
      ctx.beginPath();
      ctx.roundRect(x - 14, y - 8, 28, 26, 4);
      ctx.fill();
      ctx.strokeStyle = '#047857'; // Moss green trim
      ctx.lineWidth = 2;
      ctx.stroke();

      // Slanted stone ledger
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(x - 18, y - 8);
      ctx.lineTo(x + 18, y - 8);
      ctx.lineTo(x + 14, y - 24);
      ctx.lineTo(x - 14, y - 24);
      ctx.closePath();
      ctx.fill();

      // Glowing Cyan Ancient Runes
      const pulse = 0.5 + Math.sin(t * 3) * 0.5;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + pulse * 0.6})`;
      ctx.font = 'bold 12px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('𝄡 ♫ 𝄢', x, y - 13);

    } else if (propType === 'golden_music_stand') {
      // ✨ Gilded Brass Ornate Conservatory Stand
      ctx.fillStyle = '#ca8a04'; // Polished gold shaft
      ctx.fillRect(x - 3, y - 16, 6, 32);
      // Pedestal base
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(x, y + 16, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ornate gilded desk
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(x - 14, y - 28, 28, 16, 3);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Radiant star
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ 🎼', x, y - 16);

    } else if (propType === 'treasure_chest') {
      // 🎁 Gilded Redwood Treasure Chest
      ctx.fillStyle = '#78350f'; // Dark polished wood
      ctx.beginPath();
      ctx.roundRect(x - 14, y - 10, 28, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#eab308'; // Gold banding
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fbbf24'; // Gold lock clasp
      ctx.fillRect(x - 3, y - 2, 6, 6);
      // Floating sparkles
      const sparkY = Math.sin(t * 4) * 3;
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨', x + 12, y - 10 + sparkY);
    } else if (propType === 'vista_monolith') {
      // 🔮 Acoustic Inspiration Vista Monolith (Resonant Tuning Crystal)
      ctx.fillStyle = '#1e293b'; // Stepped dais
      ctx.beginPath();
      ctx.ellipse(x, y + 14, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Crystal Tuning Monolith
      const glow = (Math.sin(t * 2.5) + 1) / 2;
      ctx.fillStyle = `rgba(168, 85, 247, ${0.7 + glow * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 12);
      ctx.lineTo(x - 12, y - 16);
      ctx.lineTo(x, y - 32);
      ctx.lineTo(x + 12, y - 16);
      ctx.lineTo(x + 8, y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shimmering Sonic Ring
      ctx.strokeStyle = `rgba(216, 180, 254, ${glow * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y - 10, 18 + glow * 8, 8 + glow * 4, 0, 0, Math.PI * 2);
      ctx.stroke();

    } else if (propType === 'road_sign') {
      // 🗺️ Directional Road Signpost with Specific Destinations
      let topText = 'Grand Symphony';
      let bottomText = 'Cavatina Plaza';
      let topPointsLeft = true;
      let bottomPointsLeft = false;

      if (npc?.id === 'npc_signpost_west_arch' || npc?.id === 'npc_sign_west_wilds') {
        topText = 'Grand Symphony';
        topPointsLeft = false;
        bottomText = 'Cavatina Village';
        bottomPointsLeft = true;
      } else if (npc?.id === 'npc_signpost_east_gate' || npc?.id === 'npc_sign_east_wilds') {
        topText = 'Woodwind Woods';
        topPointsLeft = false;
        bottomText = 'Grand Symphony';
        bottomPointsLeft = true;
      } else if (npc?.id === 'npc_signpost_north_gate' || npc?.id === 'npc_sign_north_wilds') {
        topText = 'Brass Citadel';
        topPointsLeft = true;
        bottomText = 'Grand Symphony';
        bottomPointsLeft = false;
      } else if (npc?.id === 'npc_signpost_south_bridge' || npc?.id === 'npc_sign_south_wilds') {
        topText = 'Percussion Peaks';
        topPointsLeft = false;
        bottomText = 'Grand Symphony';
        bottomPointsLeft = true;
      } else if (npc?.id === 'npc_signpost_grand_hall') {
        topText = 'Central Hub';
        topPointsLeft = false;
        bottomText = 'Cardinal Realms';
        bottomPointsLeft = true;
      } else if (npc?.id?.includes('woods')) {
        topText = 'Woodwind Woods';
        topPointsLeft = true;
        bottomText = 'Breeze Glade';
        bottomPointsLeft = false;
      } else if (npc?.id?.includes('citadel')) {
        topText = 'Brass Citadel';
        topPointsLeft = true;
        bottomText = 'Echo Canyon';
        bottomPointsLeft = false;
      } else if (npc?.id?.includes('peaks')) {
        topText = 'Percussion Peaks';
        topPointsLeft = true;
        bottomText = 'Rumble Gorge';
        bottomPointsLeft = false;
      }

      // Wooden Post
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x - 4, y - 28, 8, 52);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 3, y - 27, 6, 50);

      // Helper function to draw directional arrow board
      const drawSignBoard = (by: number, text: string, pointsLeft: boolean, color: string) => {
        const boardW = 58;
        const arrowTip = 10;
        ctx.fillStyle = color;
        ctx.strokeStyle = '#291004';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (pointsLeft) {
          ctx.moveTo(x - boardW - arrowTip, by);
          ctx.lineTo(x - boardW, by - 8);
          ctx.lineTo(x + boardW - 10, by - 8);
          ctx.lineTo(x + boardW - 10, by + 8);
          ctx.lineTo(x - boardW, by + 8);
        } else {
          ctx.moveTo(x + boardW + arrowTip, by);
          ctx.lineTo(x + boardW, by - 8);
          ctx.lineTo(x - boardW + 10, by - 8);
          ctx.lineTo(x - boardW + 10, by + 8);
          ctx.lineTo(x + boardW, by + 8);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Brass Nail on Post
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, by, 2, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9.5px "Inter", sans-serif';
        ctx.textAlign = 'center';
        const displayLabel = pointsLeft ? `⬅ ${text}` : `${text} ➔`;
        const textOffset = pointsLeft ? -4 : 4;
        ctx.fillText(displayLabel, x + textOffset, by + 3.5);
      };

      // Top Signboard (Outward Destination)
      drawSignBoard(y - 18, topText, topPointsLeft, '#b45309');
      // Bottom Signboard (Return Destination)
      drawSignBoard(y - 2, bottomText, bottomPointsLeft, '#92400e');

    } else if (propType === 'lectern') {
      // Grand Wooden Theory Lectern
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x - 12, y, 24, 20);
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x + 20, y);
      ctx.lineTo(x + 16, y - 12);
      ctx.lineTo(x - 16, y - 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x - 14, y - 16, 28, 12);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♫ 📖', x, y - 7);

    } else if (propType === 'vanity') {
      // Maestro Styling Vanity Mirror
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(x, y - 8, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(x, y - 8, 10, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x - 8, y + 10, 4, 12);
      ctx.fillRect(x + 4, y + 10, 4, 12);

    } else if (propType === 'door_trigger') {
      // Subtle glowing ambient entrance beacon at doorway
      const pulse = 0.5 + Math.sin(t * 3) * 0.5;
      ctx.fillStyle = `rgba(251, 191, 36, ${0.15 + pulse * 0.15})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Standard Music stand with sheet
      ctx.fillStyle = '#475569';
      ctx.fillRect(x - 2, y - 12, 4, 28);
      ctx.fillRect(x - 8, y + 14, 16, 3);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x - 10, y - 20, 20, 14);
      ctx.fillStyle = '#0f172a';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎼', x, y - 9);
    }
  }

  /* ---------------- PIXEL ART HELPERS ---------------- */

  private drawPixelMusician(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    m: Musician,
    t: number,
    custom?: PlayerCustomization,
    dir: 'up' | 'down' | 'left' | 'right' = 'down'
  ): void {
    const bob = Math.sin(t * 6) * 2;
    const outfit = m.isPlayer && custom ? custom.outfitColor : m.paletteColor;
    const hair = m.isPlayer && custom ? custom.hairColor : '#475569';
    const hat = m.isPlayer && custom ? custom.hatStyle : (m.isPlayer ? 'beret' : 'none');

    // Soft Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 24, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Boots
    ctx.fillStyle = '#1e293b';
    if (dir === 'left' || dir === 'right') {
      ctx.fillRect(x - 3, y + 14 + bob, 4, 10);
      ctx.fillRect(x + 1, y + 14 - bob, 4, 10);
    } else {
      ctx.fillRect(x - 6, y + 14 + bob, 4, 10);
      ctx.fillRect(x + 2, y + 14 - bob, 4, 10);
    }

    // Torso / Tunic
    ctx.fillStyle = outfit;
    ctx.beginPath();
    if (dir === 'left' || dir === 'right') {
      ctx.roundRect(x - 8, y + bob, 16, 16, 4);
    } else {
      ctx.roundRect(x - 10, y + bob, 20, 16, 4);
    }
    ctx.fill();

    // Collar / Cloak
    if (dir !== 'up') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (dir === 'left') {
        ctx.roundRect(x - 7, y + bob, 6, 4, 2);
      } else if (dir === 'right') {
        ctx.roundRect(x + 1, y + bob, 6, 4, 2);
      } else {
        ctx.roundRect(x - 5, y + bob, 10, 4, 2);
      }
      ctx.fill();
    }

    // Head / Hair / Eyes based on direction
    if (dir === 'up') {
      // Walking away / UP -> View from behind! No face/eyes, full hair
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.arc(x, y - 10 + bob, 11, 0, Math.PI * 2);
      ctx.fill();
    } else if (dir === 'left') {
      // Walking LEFT -> Profile facing left
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x - 2, y - 10 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Eye looking left
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 8, y - 11 + bob, 2, 3);

      // Hair covering top & back right
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.arc(x - 2, y - 13 + bob, 11, Math.PI * 0.7, Math.PI * 0.1);
      ctx.fill();
      ctx.fillRect(x + 2, y - 12 + bob, 6, 9);
    } else if (dir === 'right') {
      // Walking RIGHT -> Profile facing right
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x + 2, y - 10 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Eye looking right
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 6, y - 11 + bob, 2, 3);

      // Hair covering top & back left
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.arc(x + 2, y - 13 + bob, 11, Math.PI * 0.9, Math.PI * 0.3);
      ctx.fill();
      ctx.fillRect(x - 8, y - 12 + bob, 6, 9);
    } else {
      // Walking DOWN / Front facing
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x, y - 10 + bob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Eyes looking down/forward
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 4, y - 11 + bob, 2, 3);
      ctx.fillRect(x + 2, y - 11 + bob, 2, 3);

      // Hair bangs
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.arc(x, y - 13 + bob, 11, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x - 10, y - 12 + bob, 3, 7);
      ctx.fillRect(x + 7, y - 12 + bob, 3, 7);
    }

    // Hat / Accessory
    const hatOffsetX = dir === 'left' ? -3 : (dir === 'right' ? 3 : 0);
    if (hat === 'beret') {
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.ellipse(x + 2 + hatOffsetX, y - 17 + bob, 13, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(x + 4 + hatOffsetX, y - 22 + bob, 2, 4);
    } else if (hat === 'feather_cap') {
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.ellipse(x + hatOffsetX, y - 17 + bob, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(x + 6 + hatOffsetX, y - 17 + bob);
      ctx.lineTo(x + 12 + hatOffsetX, y - 28 + bob);
      ctx.lineTo(x + 4 + hatOffsetX, y - 22 + bob);
      ctx.fill();
    } else if (hat === 'maestro') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 11 + hatOffsetX, y - 18 + bob, 22, 4);
      ctx.fillRect(x - 8 + hatOffsetX, y - 30 + bob, 16, 12);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 8 + hatOffsetX, y - 20 + bob, 16, 2);
    } else if (hat === 'headband') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - 10 + hatOffsetX, y - 14 + bob, 20, 3);
    }

    // Handheld Instrument
    const finish = m.isPlayer && custom ? custom.instrumentFinish : 'classic_amber';
    let instColor = '#d97706';
    if (finish === 'gilded_gold') instColor = '#fbbf24';
    if (finish === 'midnight_obsidian') instColor = '#1e1b4b';
    if (finish === 'rosewood') instColor = '#881337';

    const instX = dir === 'left' ? x - 11 : (dir === 'up' ? x - 8 : x + 11);

    if (m.section === 'strings') {
      ctx.fillStyle = instColor;
      ctx.beginPath();
      ctx.ellipse(instX, y + 4 + bob, 6, 9, dir === 'left' ? -0.4 : 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (dir === 'left') {
        ctx.moveTo(instX - 3, y - 4 + bob);
        ctx.lineTo(instX + 4, y + 14 + bob);
      } else {
        ctx.moveTo(instX + 3, y - 4 + bob);
        ctx.lineTo(instX - 4, y + 14 + bob);
      }
      ctx.stroke();
    } else if (m.section === 'woodwinds') {
      ctx.fillStyle = '#e2e8f0';
      if (dir === 'left') ctx.fillRect(x - 24, y - 2 + bob, 16, 3);
      else if (dir === 'up') ctx.fillRect(x - 3, y - 8 + bob, 6, 18);
      else ctx.fillRect(x + 8, y - 2 + bob, 16, 3);
    } else if (m.section === 'brass') {
      ctx.fillStyle = '#fbbf24';
      if (dir === 'left') {
        ctx.fillRect(x - 18, y + 2 + bob, 10, 4);
        ctx.beginPath();
        ctx.moveTo(x - 18, y + bob);
        ctx.lineTo(x - 24, y - 3 + bob);
        ctx.lineTo(x - 24, y + 7 + bob);
        ctx.fill();
      } else if (dir === 'up') {
        ctx.fillRect(x - 6, y - 6 + bob, 4, 12);
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 6 + bob);
        ctx.lineTo(x - 2, y - 6 + bob);
        ctx.lineTo(x - 5, y - 12 + bob);
        ctx.fill();
      } else {
        ctx.fillRect(x + 8, y + 2 + bob, 10, 4);
        ctx.beginPath();
        ctx.moveTo(x + 18, y + bob);
        ctx.lineTo(x + 24, y - 3 + bob);
        ctx.lineTo(x + 24, y + 7 + bob);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#fde047';
      ctx.fillRect(instX - 4, y + 2 + bob, 8, 2);
      ctx.fillRect(instX - 2, y + 8 + bob, 8, 2);
    }
  }

  private drawPixelPet(ctx: CanvasRenderingContext2D, x: number, y: number, pet: Harmonipet, t: number, tint?: string, dir: 'up' | 'down' | 'left' | 'right' = 'down'): void {
    const hop = Math.abs(Math.sin(t * 6)) * 4;
    const bodyColor = tint || pet.color;

    ctx.save();
    ctx.translate(x, y);

    // Soft Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const spriteType = pet.sprite ? pet.sprite.toLowerCase() : '';

    if (dir === 'left') {
      ctx.scale(-1, 1);
    }

    if (dir === 'up') {
      // 🐾 BACK VIEW (Looking Up / Away)
      if (spriteType.includes('swan')) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, -hop + 2, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -hop + 2);
        ctx.lineTo(0, -hop - 8);
        ctx.stroke();
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(-5, -hop + 2, 4, 6, 0.2, 0, Math.PI * 2);
        ctx.ellipse(5, -hop + 2, 4, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (spriteType.includes('finch')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-6, -hop - 2, 2, 5);
        ctx.fillRect(4, -hop - 2, 2, 5);
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-2, -hop + 6, 4, 4);
      } else if (spriteType.includes('terrier') || spriteType.includes('hound')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.roundRect(-7, -hop - 2, 14, 10, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -hop - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-6, -hop - 6, 3, 5);
        ctx.fillRect(3, -hop - 6, 3, 5);
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -hop + 6);
        ctx.lineTo(Math.sin(t * 12) * 5, -hop + 12);
        ctx.stroke();
      } else {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, -hop - 10, 3, 4);
        ctx.fillRect(3, -hop - 10, 3, 4);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(Math.sin(t * 8) * 3, -hop + 8, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (dir === 'down') {
      // 🐾 FRONT VIEW (Looking Down / Facing Player)
      if (spriteType.includes('swan')) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, -hop + 2, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(-6, -hop + 2, 4, 5, -0.2, 0, Math.PI * 2);
        ctx.ellipse(6, -hop + 2, 4, 5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, -hop - 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.fillRect(-2, -hop - 4, 4, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -hop - 7, 2, 2);
        ctx.fillRect(1, -hop - 7, 2, 2);
      } else if (spriteType.includes('finch')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, -hop + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, -hop - 1);
        ctx.lineTo(3, -hop + 2);
        ctx.lineTo(-3, -hop + 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, -hop - 3, 2, 2);
        ctx.fillRect(2, -hop - 3, 2, 2);
      } else if (spriteType.includes('terrier') || spriteType.includes('hound')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.roundRect(-7, -hop - 2, 14, 10, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -hop - 5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(-6, -hop - 3, 3, 5, -0.3, 0, Math.PI * 2);
        ctx.ellipse(6, -hop - 3, 3, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-3, -hop - 7, 2, 2);
        ctx.fillRect(1, -hop - 7, 2, 2);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-2, -hop - 3, 4, 3);
      } else if (spriteType.includes('raccoon')) {
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, -hop, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, -hop - 3, 12, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -hop - 2, 2, 2);
        ctx.fillRect(2, -hop - 2, 2, 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-2, -hop + 1, 4, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-1, -hop + 1, 2, 2);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, -hop - 9, 3, 4);
        ctx.fillRect(3, -hop - 9, 3, 4);
      } else {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, -hop - 2, 2, 3);
        ctx.fillRect(2, -hop - 2, 2, 3);
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-6, -hop - 10, 3, 4);
        ctx.fillRect(3, -hop - 10, 3, 4);
      }

    } else {
      // 🐾 SIDE PROFILE (Left or Right, flipped via scale(-1, 1) when dir === 'left')
      if (spriteType.includes('swan')) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, -hop + 2, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(4, -hop + 2);
        ctx.quadraticCurveTo(10, -hop - 6, 6, -hop - 10);
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        ctx.fillRect(8, -hop - 10, 4, 2);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(5, -hop - 11, 2, 2);
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(-2, -hop + 1, 6, 4, Math.sin(t * 8) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      } else if (spriteType.includes('finch')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(2, -hop + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(6, -hop - 1);
        ctx.lineTo(11, -hop);
        ctx.lineTo(6, -hop + 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(3, -hop - 3, 2, 2);
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-10, -hop - 2, 5, 3);
      } else if (spriteType.includes('terrier') || spriteType.includes('hound')) {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.roundRect(-8, -hop - 2, 14, 9, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, -hop - 4, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(4, -hop - 2 + Math.sin(t * 8) * 2, 3, 5, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(10, -hop - 4, 2, 2);
        ctx.fillRect(6, -hop - 6, 2, 2);
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -hop);
        ctx.lineTo(-13, -hop - 6 + Math.sin(t * 12) * 4);
        ctx.stroke();
      } else if (spriteType.includes('raccoon')) {
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(0, -hop, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-5, -hop - 2, 11, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -hop - 1, 2, 2);
        ctx.fillRect(2, -hop - 1, 2, 2);
        ctx.fillStyle = '#334155';
        ctx.fillRect(-6, -hop - 9, 3, 4);
        ctx.fillRect(3, -hop - 9, 3, 4);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(-10, -hop + 2, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(0, -hop, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, -hop - 2, 2, 3);
        ctx.fillRect(2, -hop - 2, 2, 3);
        ctx.fillStyle = bodyColor;
        ctx.fillRect(-6, -hop - 10, 3, 4);
        ctx.fillRect(3, -hop - 10, 3, 4);
      }
    }

    if (Math.sin(t * 3) > 0.5) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('♪', 8, -hop - 10);
    }

    ctx.restore();
  }

  private drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, val: number, max: number, color: string, label: string): void {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();

    const fillW = Math.max(0, Math.min(w, (val / max) * w));
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, fillW, h, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h - 4);
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): void {
    const words = text.split(' ');
    let line = '';
    let currY = y;
    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line.trim(), x, currY);
        line = w + ' ';
        currY += lineH;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, currY);
  }

  /* ---------------- WILD HARMONIPET ENCOUNTER RENDERER ---------------- */

  private renderHarmonizeWild(state: GameState): void {
    const ctx = this.ctx;
    const enc = state.harmonizeEncounter;
    if (!enc) return;

    // Background Gradient
    const bgGrad = ctx.createRadialGradient(this.width / 2, this.height / 2, 50, this.width / 2, this.height / 2, 700);
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Title
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 30px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 Wild Harmonipet Encounter!', this.width / 2, 60);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`Play harmonic intervals to attune with ${enc.pet.name} the ${enc.pet.species}!`, this.width / 2, 95);

    // Opponent Wild Creature Platform
    ctx.fillStyle = 'rgba(6, 78, 59, 0.6)';
    ctx.beginPath();
    ctx.ellipse(880, 280, 160, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '72px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const bounce = Math.sin(state.time * 4) * 8;
    ctx.fillText(enc.pet.sprite, 880, 270 + bounce);

    // Wild Creature Nameplate
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = enc.pet.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(720, 120, 320, 75, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Wild ${enc.pet.name}`, 740, 150);

    ctx.fillStyle = enc.pet.color;
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText(`${enc.pet.species} (${enc.pet.section.toUpperCase()})`, 740, 175);

    // Player Platform
    ctx.fillStyle = 'rgba(6, 78, 59, 0.6)';
    ctx.beginPath();
    ctx.ellipse(360, 420, 160, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    const player = state.ensemble.members[0];
    ctx.font = '64px "Inter", sans-serif';
    ctx.fillText(player.avatar, 340, 410);
    ctx.font = '48px "Inter", sans-serif';
    ctx.fillText(player.pet.sprite, 410, 415 + Math.cos(state.time * 4) * 6);

    // Central Resonance Meter
    const barW = 500;
    const barH = 26;
    const barX = (this.width - barW) / 2;
    const barY = 350;
    this.drawBar(ctx, barX, barY, barW, barH, enc.resonanceMeter, 100, '#10b981', `Resonance: ${enc.resonanceMeter}% (Threshold: ${enc.catchThreshold}%)`);

    // Threshold Marker
    const threshX = barX + (enc.catchThreshold / 100) * barW;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(threshX, barY - 4);
    ctx.lineTo(threshX, barY + barH + 4);
    ctx.stroke();

    // Melody Sequence Call & Response Display (Hidden, challenging, ear-training!)
    const noteNames = ['C4', 'E4', 'G4', 'C5'];
    const targetPills = enc.targetNoteIndices.map((nIdx, idx) => {
      const isRevealed = enc.revealedSteps && enc.revealedSteps[idx];
      const isCurrent = idx === enc.currentStep;
      const text = isRevealed ? `Note ${idx + 1}: ${noteNames[nIdx]} ♪` : (isCurrent ? `Note ${idx + 1}: [ ? ]` : `Note ${idx + 1}: ?`);
      return { text, isRevealed, isCurrent };
    });

    const seqW = 620;
    const seqH = 44;
    const seqX = (this.width - seqW) / 2;
    const seqY = 390;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(seqX, seqY, seqW, seqH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🎵 Melody:', seqX + 16, seqY + 27);

    const pillStartX = seqX + 100;
    const pillGap = 8;
    const pillW = (seqW - 115 - (targetPills.length - 1) * pillGap) / targetPills.length;

    targetPills.forEach((p, idx) => {
      const px = pillStartX + idx * (pillW + pillGap);
      ctx.fillStyle = p.isRevealed ? 'rgba(16, 185, 129, 0.4)' : (p.isCurrent ? 'rgba(245, 158, 11, 0.25)' : 'rgba(30, 41, 59, 0.6)');
      ctx.strokeStyle = p.isRevealed ? '#34d399' : (p.isCurrent ? '#fbbf24' : '#475569');
      ctx.lineWidth = p.isCurrent || p.isRevealed ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(px, seqY + 7, pillW, 30, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = p.isRevealed ? '#a7f3d0' : (p.isCurrent ? '#fef08a' : '#94a3b8');
      ctx.font = p.isCurrent || p.isRevealed ? 'bold 11px "Inter", sans-serif' : '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, px + pillW / 2, seqY + 26);
    });

    // Replay Melody / Status Button
    const repW = 240;
    const repH = 36;
    const repX = (this.width - repW) / 2;
    const repY = 442;
    ctx.fillStyle = enc.isPlayingMelody ? 'rgba(245, 158, 11, 0.25)' : 'rgba(14, 165, 233, 0.25)';
    ctx.strokeStyle = enc.isPlayingMelody ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(repX, repY, repW, repH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = enc.isPlayingMelody ? '#fbbf24' : '#38bdf8';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(enc.isPlayingMelody ? '🎶 Playing Creature Call...' : '👂 [R] Replay Melody Tune', repX + repW / 2, repY + 23);

    // Feedback or Attempts Banner
    if (enc.lastFeedbackText) {
      ctx.fillStyle = enc.lastFeedback === 'PERFECT' ? '#34d399' : '#f87171';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(enc.lastFeedbackText, this.width / 2, 492);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Auditory Attempts: ${enc.attemptsRemaining} / 5  •  Match pitch sequence by ear!`, this.width / 2, 492);
    }

    // Note Action Buttons (Uniform, no target giveaway!)
    const notes = [
      { label: '[1] C4 (Root)', sub: 'Foundation' },
      { label: '[2] E4 (Third)', sub: 'Harmonic Warmth' },
      { label: '[3] G4 (Fifth)', sub: 'Consonance' },
      { label: '[4] C5 (Octave)', sub: 'Overtone Surge' }
    ];

    const cardW = 190;
    const cardH = 75;
    const gap = 16;
    const startX = (this.width - (cardW * 4 + gap * 3)) / 2;
    const cardY = 512;

    notes.forEach((n, idx) => {
      const cx = startX + idx * (cardW + gap);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, cx + cardW / 2, cardY + 32);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(n.sub, cx + cardW / 2, cardY + 54);
    });
  }

  /* ---------------- MUSIC THEORY CHALLENGE RENDERER ---------------- */

  private renderTheoryChallenge(state: GameState): void {
    const ctx = this.ctx;
    const ch = state.theoryChallenge;
    if (!ch) return;

    const q = ch.questions[ch.currentQuestionIndex];
    if (!q) return;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.width, this.height);

    // Header Card
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(140, 30, this.width - 280, 195, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎼 ${ch.title ? ch.title.toUpperCase() : 'MUSIC THEORY DRILL'}`, this.width / 2, 58);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText(q.prompt, this.width / 2, 95);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(q.subtext, this.width / 2, 135);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText(`Question ${ch.currentQuestionIndex + 1} of ${ch.questions.length} | Score: ${ch.score} pts | Target Reward: +${ch.rewardSparks || 25} Sparks ✨, +${ch.rewardSightReading || 3} RDG 📖`, this.width / 2, 185);

    // If audio drill, show Replay Button
    if (q.notesToPlay && q.notesToPlay.length > 0) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 120, 240, 240, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText('🔊 Replay Pitch [R]', this.width / 2, 267);
    }

    // 4 Option Cards
    const optW = 460;
    const optH = 75;
    const startY = q.notesToPlay ? 310 : 250;
    const gapY = 20;

    q.options.forEach((optText, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ox = col === 0 ? this.width / 2 - optW - 15 : this.width / 2 + 15;
      const oy = startY + row * (optH + gapY);

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ox, oy, optW, optH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${idx + 1}]`, ox + 20, oy + 44);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '16px "Inter", sans-serif';
      ctx.fillText(optText, ox + 60, oy + 44);
    });
  }
}
