import { GameState, Harmonipet, Musician, PlayerCustomization, WorldObstacle, WorldNPC, InstrumentSection } from './types';
import { WORLD_ZONES, STARTER_OPTIONS, getBattleMovesForMusician, ALL_INSTRUMENTS_INFO, SECTION_ACTIONS } from './data';

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

    if (state.mode === 'battle_lineup') {
      this.renderPreBattle(state);
      this.renderDialogue(state);
      return;
    }

    if (state.mode === 'phone_menu' || state.phoneOpen) {
      this.renderWorldMap(state);
      this.renderHUD(state);
      this.renderPhoneMenu(state);
      this.renderDialogue(state);
      return;
    }

    // Default: Exploration Mode
    this.renderWorldMap(state);
    this.renderHUD(state);
    if (state.showQuickWheel) {
      this.renderQuickWheel(state);
    }
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
    const gap = Math.min(30, Math.max(10, (this.width - 760) / 16));
    const cardW = Math.min(260, (this.width - 60 - gap * 3) / 4);
    const cardH = Math.min(460, this.height - 180);
    const startX = (this.width - (cardW * 4 + gap * 3)) / 2;
    const cardY = Math.min(160, this.height - cardH - 20);

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
      ctx.roundRect(x + 15, cardY + 16, cardW - 30, 26, 8);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opt.sectionName.toUpperCase(), x + cardW / 2, cardY + 29);

      // Pet Avatar & Sprite
      ctx.textBaseline = 'alphabetic';
      this.drawPixelPet(ctx, x + cardW / 2, cardY + 105, opt.pet, state.time);

      // Pet Name & Species
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(opt.name, x + cardW / 2, cardY + 165);

      ctx.fillStyle = opt.pet.color;
      ctx.font = 'italic 13px "Inter", sans-serif';
      ctx.fillText(`Familiar: ${opt.pet.name}`, x + cardW / 2, cardY + 188);

      // Description - Centered within the card
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      this.wrapText(ctx, opt.description, x + cardW / 2, cardY + 212, cardW - 24, 16);

      // Base Stats
      const statY = cardY + cardH - 142;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Technique: ${opt.baseStats.technique}`, x + 18, statY);
      ctx.fillText(`Tone Quality: ${opt.baseStats.toneQuality}`, x + 18, statY + 18);
      ctx.fillText(`Tempo: ${opt.baseStats.tempoStability}`, x + 18, statY + 36);
      ctx.fillText(`Sight-Reading: ${opt.baseStats.sightReading}`, x + 18, statY + 54);

      // Choose Button Prompt
      ctx.textAlign = 'center';
      ctx.fillStyle = opt.pet.color;
      ctx.beginPath();
      ctx.roundRect(x + 15, cardY + cardH - 44, cardW - 30, 32, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Press [${idx + 1}] or Click`, x + cardW / 2, cardY + cardH - 28);
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
    const hwW = Math.min(520, Math.max(320, this.width * 0.42));
    const hwH = Math.min(460, this.height - 180);
    const hwX = Math.max(150, (this.width - (hwW + 260 + 20)) / 2);
    const hwY = 105;

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
      ctx.font = 'bold 14px "Inter", sans-serif';
      const keyName = i === 0 ? '1 / D' : (i === 1 ? '2 / F' : (i === 2 ? '3 / J' : '4 / K'));
      ctx.fillText(keyName, hwX + i * laneW + laneW / 2, hwY + hwH - 18);
    }

    // Target Hit Line (at Y: hwY + hwH - 65)
    const targetY = hwY + hwH - 65;
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
        ctx.arc(noteX, noteY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Left Panel: Stats & Combo
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${Math.floor(session.score)}`, 24, 180);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`Combo: ${session.combo}x`, 24, 215);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText(`Max: ${session.maxCombo}x`, 24, 248);

    // Feedback popup
    if (session.feedbackTimer > 0) {
      ctx.fillStyle = session.feedbackText.includes('PERFECT') ? '#eab308' : (session.feedbackText.includes('MISS') ? '#ef4444' : '#38bdf8');
      ctx.font = 'bold 32px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(session.feedbackText, hwX + hwW / 2, hwY + hwH / 2);
    }

    // Lane Solfège Labels at Hit Zone
    const laneSolfege = ['Do (C4)', 'Mi (E4)', 'Sol (G4)', 'Do (C5)'];
    const laneColors = ['#ef4444', '#eab308', '#06b6d4', '#ec4899'];
    for (let i = 0; i < 4; i++) {
      if (state.showStaffVisualizer) {
        ctx.fillStyle = laneColors[i];
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(laneSolfege[i], hwX + i * laneW + laneW / 2, targetY + 22);
      }
    }

    // Toggle Prompt beneath Highway
    ctx.fillStyle = state.showStaffVisualizer ? '#38bdf8' : '#94a3b8';
    ctx.font = '13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`[V] Toggle Staff & Solfège: ${state.showStaffVisualizer ? 'ON' : 'OFF'}`, hwX + hwW / 2, hwY + hwH + 26);

    // ==================== RIGHT PANEL: GRAND STAFF & SOLFÈGE VISUALIZER ====================
    const staffW = Math.min(260, Math.max(200, this.width - (hwX + hwW + 24)));
    const staffX = hwX + hwW + 16;
    const staffY = hwY;
    const staffH = hwH;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = state.showStaffVisualizer ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(staffX, staffY, staffW, staffH, 16);
    ctx.fill();
    ctx.stroke();

    if (!state.showStaffVisualizer) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GRAND STAFF VISUALIZER', staffX + staffW / 2, staffY + 180);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText('Press [V] to Enable', staffX + staffW / 2, staffY + 220);
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Real-time Treble & Bass Clef', staffX + staffW / 2, staffY + 260);
      ctx.fillText('Solfège (Do, Re, Mi, Fa, Sol, La, Ti)', staffX + staffW / 2, staffY + 285);
    } else {
      // Header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎼 GRAND STAFF & SOLFÈGE', staffX + staffW / 2, staffY + 30);

      // Treble Clef Staff (5 Lines: E4, G4, B4, D5, F5)
      const staffLineStartX = staffX + 25;
      const staffLineEndX = staffX + staffW - 25;
      const trebleBaseY = staffY + 70;
      const lineSpacing = 14;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      for (let l = 0; l < 5; l++) {
        const y = trebleBaseY + l * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(staffLineStartX, y);
        ctx.lineTo(staffLineEndX, y);
        ctx.stroke();
      }

      // Treble Clef Glyph & Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('𝄞', staffLineStartX + 5, trebleBaseY + 38);
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Treble (G Clef)', staffLineStartX + 30, trebleBaseY - 6);

      // Middle C (C4) Ledger Line & Do
      const midCY = trebleBaseY + 5 * lineSpacing + 10;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(staffX + staffW / 2 - 25, midCY);
      ctx.lineTo(staffX + staffW / 2 + 25, midCY);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(staffX + staffW / 2, midCY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Do (C4)', staffX + staffW / 2, midCY - 10);

      // Bass Clef Staff (5 Lines: G2, B2, D3, F3, A3)
      const bassBaseY = midCY + 26;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      for (let l = 0; l < 5; l++) {
        const y = bassBaseY + l * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(staffLineStartX, y);
        ctx.lineTo(staffLineEndX, y);
        ctx.stroke();
      }

      // Bass Clef Glyph & Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('𝄢', staffLineStartX + 5, bassBaseY + 30);
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Bass (F Clef)', staffLineStartX + 30, bassBaseY - 6);

      // Active Note Highlighting on Staff
      const upcomingNote = session.notes.find(n => !n.hit && !n.missed && (n.targetTime - session.elapsedTime) > -0.1 && (n.targetTime - session.elapsedTime) < 1.0);
      if (upcomingNote) {
        let noteY = midCY;
        if (upcomingNote.lane === 0) noteY = midCY; // C4
        else if (upcomingNote.lane === 1) noteY = trebleBaseY + 4 * lineSpacing; // E4 (bottom line)
        else if (upcomingNote.lane === 2) noteY = trebleBaseY + 3 * lineSpacing; // G4 (second line)
        else if (upcomingNote.lane === 3) noteY = trebleBaseY + lineSpacing; // C5 (third space)

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(staffLineEndX - 40, noteY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Solfège Reference Scale Pills (Do, Re, Mi, Fa, Sol, La, Ti)
      const solfegeItems = [
        { syllable: 'Do', note: 'C', color: '#ef4444' },
        { syllable: 'Re', note: 'D', color: '#f97316' },
        { syllable: 'Mi', note: 'E', color: '#eab308' },
        { syllable: 'Fa', note: 'F', color: '#22c55e' },
        { syllable: 'Sol', note: 'G', color: '#06b6d4' },
        { syllable: 'La', note: 'A', color: '#6366f1' },
        { syllable: 'Ti', note: 'B', color: '#a855f7' }
      ];

      const pillStartY = staffY + 330;
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIATONIC SOLFÈGE SCALE', staffX + staffW / 2, pillStartY);

      const pillW = 32;
      const pillH = 38;
      const pillGap = 5;
      const totalPillsW = 7 * pillW + 6 * pillGap;
      const pillStartX = staffX + (staffW - totalPillsW) / 2;

      solfegeItems.forEach((item, idx) => {
        const px = pillStartX + idx * (pillW + pillGap);
        const py = pillStartY + 12;

        ctx.fillStyle = `${item.color}22`;
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(px, py, pillW, pillH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = item.color;
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText(item.syllable, px + pillW / 2, py + 16);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(item.note, px + pillW / 2, py + 30);
      });

      // Pedagogical Tip
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 11px "Inter", sans-serif';
      ctx.fillText('Fixed-Do Solfège: C is always Do', staffX + staffW / 2, staffY + 450);
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
    const barW = Math.min(300, (this.width - 200) / 2);
    this.drawBar(ctx, 60, 140, barW, 24, battle.playerHarmonyMeter, 100, '#38bdf8', '🎵 Harmony Composure: ' + battle.playerHarmonyMeter + '%');
    // Harmony Action Points (AP)
    this.drawBar(ctx, 60, 175, barW, 16, battle.harmonyPoints, battle.maxHarmonyPoints, '#fbbf24', '⚡ Energy (AP): ' + battle.harmonyPoints + ' / ' + battle.maxHarmonyPoints);

    // Stance Badges
    if (battle.playerStance !== 'normal') {
      ctx.fillStyle = battle.playerStance === 'pianissimo_shield' ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(`🛡️ [STANCE: ${battle.playerStance.toUpperCase().replace('_', ' ')}]`, 60, 205);
    }

    // Right: Opponent & Familiar
    const opp = battle.opponent;
    ctx.fillStyle = opp.paletteColor;
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${opp.name} (${opp.instrumentName})`, this.width - 60, 120);
    this.drawPixelMusician(ctx, this.width - 200, 260, opp, state.time, undefined, 'left');
    this.drawPixelPet(ctx, this.width - 300, 280, opp.pet, state.time, undefined, 'left');

    // Opponent Resonance Meter (Their Composure to 100% loss)
    this.drawBar(ctx, this.width - 60 - barW, 140, barW, 24, battle.opponentHarmonyMeter, 100, opp.paletteColor, '🎻 Rival Resonance: ' + battle.opponentHarmonyMeter + '%');

    if (battle.opponentStance !== 'normal') {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(`⚠️ [STANCE: ${battle.opponentStance.toUpperCase().replace('_', ' ')}]`, this.width - 60 - barW, 205);
    }

    // Middle: Battle Move Action Bar (4 Tactical Actions matching player's actual instrument)
    const moves = getBattleMovesForMusician(player);
    const moveGap = Math.min(15, Math.max(8, (this.width - 600) / 16));
    const moveW = Math.min(250, (this.width - 60 - moveGap * 3) / 4);
    const moveH = Math.min(68, Math.max(54, this.height * 0.1));
    const moveStartX = (this.width - (moveW * 4 + moveGap * 3)) / 2;
    const moveY = Math.min(460, this.height - 230);

    let hoveredMove: any = null;
    let hoveredIdx = -1;

    moves.forEach((m, idx) => {
      const mx = moveStartX + idx * (moveW + moveGap);
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
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${idx + 1}] ${m.name}`, mx + 12, moveY + 26);

      // Clean, uncrowded stat badge
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Inter", sans-serif';
      let tag = `Cost: ${m.harmonyCost} HP | Power: +${m.power}%`;
      if (m.effect === 'pianissimo_shield') tag = `Cost: ${m.harmonyCost} HP | +25 HP / 50% Guard`;
      if (m.effect === 'fortissimo_surge') tag = `Cost: ${m.harmonyCost} HP | 2x Power Surge`;
      ctx.fillText(tag, mx + 12, moveY + 48);
    });

    // Floating Tactical Hover Tooltip Box (Right above action buttons)
    if (hoveredMove) {
      const tipW = Math.min(760, this.width - 60);
      const tipH = 46;
      const tipX = (this.width - tipW) / 2;
      const tipY = moveY - tipH - 8;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.97)';
      ctx.strokeStyle = hoveredIdx >= 2 ? (hoveredIdx === 2 ? '#10b981' : '#f59e0b') : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, tipH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`💡 TECHNIQUE DETAILS: ${hoveredMove.name.toUpperCase()}`, tipX + 14, tipY + 16);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(hoveredMove.description, tipX + 14, tipY + 34);
    } else if (!battle.synergyMoves || battle.synergyMoves.length === 0) {
      // Gentle hint when not hovering and no synergy
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💡 Hover over any technique card to inspect tactical properties and mechanics.', this.width / 2, moveY - 14);
    }

    // Pet Synergy Unison Attack Button
    if (battle.synergyMoves && battle.synergyMoves.length > 0) {
      const syn = battle.synergyMoves[0];
      const synW = Math.min(540, this.width - 80);
      const synH = 34;
      const synX = (this.width - synW) / 2;
      const synY = moveY - synH - 8;
      const isSynHovered = this.mousePos.x >= synX && this.mousePos.x <= synX + synW &&
                           this.mousePos.y >= synY && this.mousePos.y <= synY + synH;
      const isSynAffordable = battle.harmonyPoints >= syn.cost;

      ctx.fillStyle = isSynHovered ? 'rgba(126, 34, 206, 0.95)' : (isSynAffordable ? '#581c87' : 'rgba(88, 28, 135, 0.4)');
      ctx.strokeStyle = isSynHovered ? '#fbbf24' : (isSynAffordable ? '#c084fc' : '#7e22ce');
      ctx.lineWidth = isSynHovered ? 3 : 2;
      ctx.beginPath();
      ctx.roundRect(synX, synY, synW, synH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSynAffordable ? '#fef08a' : '#c084fc';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🐾 [5 / U] UNISON ATTACK: ${syn.name} (${syn.cost} HP) — ${syn.description}`, this.width / 2, synY + 22);
    }

    // Battle Log
    const logY = moveY + moveH + 12;
    const logH = Math.max(80, this.height - logY - 16);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(60, logY, this.width - 120, logH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px "Inter", sans-serif';
    ctx.textAlign = 'left';
    const linesToShow = logH > 100 ? 4 : (logH > 80 ? 3 : 2);
    battle.log.slice(-linesToShow).forEach((logText, lIdx) => {
      ctx.fillText(`• ${logText}`, 80, logY + 24 + lIdx * 22);
    });
  }

  /* ---------------- PRE-BATTLE LINEUP SELECTION SCREEN ---------------- */

  private renderPreBattle(state: GameState): void {
    const ctx = this.ctx;
    const info = state.preBattle;
    if (!info) return;

    // Dark majestic theater gradient backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Header Title Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, this.width, 65);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 64, this.width, 1);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.title, this.width / 2, 40);

    // Left Panel: Opponent & Recommendations
    const leftX = 24;
    const leftY = 80;
    const leftW = Math.min(420, (this.width - 72) * 0.38);
    const panelH = Math.min(550, this.height - 140);
    const leftH = panelH;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.beginPath();
    ctx.roundRect(leftX, leftY, leftW, leftH, 12);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Opponent Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(leftX + 14, leftY + 14, leftW - 28, 120, 8);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '36px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(info.opponentAvatar, leftX + 50, leftY + 70);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px "Cinzel", serif';
    ctx.textAlign = 'left';
    ctx.fillText(info.opponentName, leftX + 95, leftY + 45);

    if (info.opponentSection) {
      const secColor = info.opponentSection === 'strings' ? '#ec4899' : (info.opponentSection === 'woodwinds' ? '#06b6d4' : (info.opponentSection === 'brass' ? '#f59e0b' : '#a855f7'));
      ctx.fillStyle = secColor;
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.fillText(`Section: ${info.opponentSection.toUpperCase()}`, leftX + 95, leftY + 68);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText(info.opponentDescription, leftX + 95, leftY + 90);

    // Recommendations Box
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💡 Strategic Recommendations:', leftX + 16, leftY + 165);

    const recBoxY = leftY + 180;
    const recBoxH = leftH - 195;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(leftX + 14, recBoxY, leftW - 28, recBoxH, 8);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.stroke();

    let recCurY = recBoxY + 25;
    info.recommendations.forEach((recText) => {
      ctx.fillStyle = recText.includes('⚠️') || recText.includes('❌') ? '#fca5a5' : (recText.includes('✅') ? '#86efac' : '#e2e8f0');
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'left';
      
      const words = recText.split(' ');
      let line = '';
      for (const w of words) {
        const testLine = line + w + ' ';
        if (ctx.measureText(testLine).width > leftW - 50) {
          ctx.fillText(line, leftX + 26, recCurY);
          line = '   ' + w + ' ';
          recCurY += 18;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, leftX + 26, recCurY);
      recCurY += 24;
    });

    // Right Panel: Ensemble Lineup & Reserves
    const rightX = leftX + leftW + 16;
    const rightY = 80;
    const rightW = this.width - rightX - 24;
    const rightH = panelH;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.beginPath();
    ctx.roundRect(rightX, rightY, rightW, rightH, 12);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Active Lineup Header
    const maxLineup = info.maxLineupSize || 4;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`👥 Active Ensemble Lineup (${state.ensemble.members.length} / ${maxLineup} Members • ${state.ensemble.tier.toUpperCase()} Tier):`, rightX + 16, rightY + 26);
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Click an active member to remove/bench (Player cannot be removed)', rightX + 16, rightY + 44);

    // Active Members Grid
    const activeMembers = state.ensemble.members;
    const slotGap = Math.min(14, Math.max(8, (rightW - 400) / 4));
    const slotW = Math.min(150, (rightW - 32 - slotGap * 3) / 4);
    const slotH = maxLineup > 4 ? 96 : 125;
    const activeStartX = rightX + 16;
    const activeStartY = rightY + 56;

    for (let i = 0; i < maxLineup; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const sx = activeStartX + col * (slotW + slotGap);
      const sy = activeStartY + row * (slotH + slotGap);

      const m = activeMembers[i];
      const isHovered = this.mousePos ? (this.mousePos.x >= sx && this.mousePos.x <= sx + slotW && this.mousePos.y >= sy && this.mousePos.y <= sy + slotH) : false;

      ctx.save();
      if (m) {
        const isPlayer = i === 0;
        ctx.fillStyle = isHovered && !isPlayer ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(sx, sy, slotW, slotH, 8);
        ctx.fill();
        ctx.strokeStyle = isHovered && !isPlayer ? '#ef4444' : (m.paletteColor || '#38bdf8');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = slotH < 100 ? '24px "Apple Color Emoji", sans-serif' : '32px "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.avatar, sx + slotW / 2, sy + (slotH < 100 ? 32 : 45));

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText(m.name.length > 14 ? m.name.slice(0, 12) + '..' : m.name, sx + slotW / 2, sy + (slotH < 100 ? 54 : 75));

        const secColor = m.section === 'strings' ? '#ec4899' : (m.section === 'woodwinds' ? '#06b6d4' : (m.section === 'brass' ? '#f59e0b' : '#a855f7'));
        ctx.fillStyle = secColor;
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText(m.section.toUpperCase(), sx + slotW / 2, sy + (slotH < 100 ? 70 : 95));

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`Lv.${m.level} ${m.instrumentName.slice(0, 10)}`, sx + slotW / 2, sy + (slotH < 100 ? 86 : 112));
      } else {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.beginPath();
        ctx.roundRect(sx, sy, slotW, slotH, 8);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+ Empty Slot', sx + slotW / 2, sy + slotH / 2);
      }
      ctx.restore();
    }

    // Available Reserve Musicians Roster
    const reserveY = activeStartY + (maxLineup > 4 ? (slotH + slotGap) * 2 : (slotH + slotGap)) + 12;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📦 Available Reserve Musicians (Click to deploy):', rightX + 16, reserveY);

    const allOwned = [...state.recruitedMusicians, ...state.ensembleBox];
    const reserveMusicians = allOwned.filter(m => !activeMembers.some(am => am.id === m.id));

    const resStartX = rightX + 16;
    const resStartY = reserveY + 12;
    const rCardW = slotW;
    const rCardH = maxLineup > 4 ? 54 : 64;
    const rGap = slotGap;

    if (reserveMusicians.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 12px "Inter", sans-serif';
      ctx.fillText('No reserve musicians available in box. Recruit more musicians in the world!', resStartX, resStartY + 25);
    } else {
      reserveMusicians.slice(0, 8).forEach((m, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const rx = resStartX + col * (rCardW + rGap);
        const ry = resStartY + row * (rCardH + rGap);

        const isHovered = this.mousePos ? (this.mousePos.x >= rx && this.mousePos.x <= rx + rCardW && this.mousePos.y >= ry && this.mousePos.y <= ry + rCardH) : false;

        ctx.save();
        ctx.fillStyle = isHovered ? 'rgba(34, 197, 94, 0.2)' : 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(rx, ry, rCardW, rCardH, 6);
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#22c55e' : '#475569';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '22px "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(m.avatar, rx + 8, ry + 32);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText(m.name.length > 12 ? m.name.slice(0, 10) + '..' : m.name, rx + 38, ry + 18);

        const secColor = m.section === 'strings' ? '#ec4899' : (m.section === 'woodwinds' ? '#06b6d4' : (m.section === 'brass' ? '#f59e0b' : '#a855f7'));
        ctx.fillStyle = secColor;
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText(m.section.toUpperCase(), rx + 38, ry + 32);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`Lv.${m.level} • ${m.instrumentName.slice(0, 10)}`, rx + 38, ry + 46);

        ctx.restore();
      });
    }

    // Bottom Action Buttons
    const btnW = Math.min(320, (this.width - 80) / 2);
    const btnH = 42;
    const btnY = Math.min(650, this.height - 48);

    // Start Battle Button
    const startX = this.width / 2 - btnW - 14;
    const startHovered = this.mousePos ? (this.mousePos.x >= startX && this.mousePos.x <= startX + btnW && this.mousePos.y >= btnY && this.mousePos.y <= btnY + btnH) : false;

    ctx.fillStyle = startHovered ? 'rgba(245, 158, 11, 0.95)' : 'rgba(217, 119, 6, 0.9)';
    ctx.beginPath();
    ctx.roundRect(startX, btnY, btnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️ COMMENCE BATTLE [ENTER]', startX + btnW / 2, btnY + 26);

    // Cancel Button
    const cancelX = this.width / 2 + 14;
    const cancelHovered = this.mousePos ? (this.mousePos.x >= cancelX && this.mousePos.x <= cancelX + btnW && this.mousePos.y >= btnY && this.mousePos.y <= btnY + btnH) : false;

    ctx.fillStyle = cancelHovered ? 'rgba(71, 85, 105, 0.9)' : 'rgba(30, 41, 59, 0.9)';
    ctx.beginPath();
    ctx.roundRect(cancelX, btnY, btnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('↩️ RETURN / CANCEL [ESC]', cancelX + btnW / 2, btnY + 26);
  }

  /* ---------------- CONCERT COMPETITION ARENA ---------------- */

  private renderConcertCompetition(state: GameState): void {
    const ctx = this.ctx;
    const comp = state.competition;
    if (!comp) return;

    // Concert Hall Red Velvet Backdrop & Proscenium Stage
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#1c0512');
    bgGrad.addColorStop(0.6, '#2a091a');
    bgGrad.addColorStop(1, '#15030e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Stage Floor Base
    ctx.fillStyle = '#1e110c';
    ctx.fillRect(0, 140, this.width, 175);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    for (let lineX = 0; lineX < this.width; lineX += 60) {
      ctx.beginPath();
      ctx.moveTo(lineX, 140);
      ctx.lineTo(lineX, 315);
      ctx.stroke();
    }
    const stageTrim = ctx.createLinearGradient(0, 315, 0, 320);
    stageTrim.addColorStop(0, '#d97706');
    stageTrim.addColorStop(1, '#78350f');
    ctx.fillStyle = stageTrim;
    ctx.fillRect(0, 315, this.width, 5);

    if (state.hasPianoAccompaniment && !comp.isPianistDuel) {
      const bannerW = 480;
      const bannerH = 22;
      const bannerX = this.width / 2 - bannerW / 2;
      const bannerY = 6;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 6);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎹 Concerto Piano Accompaniment Active (+50% Score Boost)', this.width / 2, bannerY + 15);
    }

    const isPianist = comp.isPianistDuel;
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 26px "Cinzel", serif';
    ctx.textAlign = 'center';
    if (isPianist) {
      const duelNames = ['Novice Busk (120 BPM)', 'Virtuoso Etude (140 BPM)', 'Transcendental Showdown (160 BPM)'];
      const dName = duelNames[Math.min((comp.duelTier || 1) - 1, duelNames.length - 1)];
      ctx.fillText(`🎹 PIANIST BUSKING DUEL: ${dName.toUpperCase()}`, this.width / 2, 45);
    } else {
      ctx.fillText(`🏆 CONCERT COMPETITION: VS ${comp.rival.name.toUpperCase()}`, this.width / 2, 45);
    }

    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText(`Piece: "${comp.playerPiece.title}" (${comp.playerPiece.genre} • ${comp.playerPiece.bpm || 120} BPM)`, this.width / 2, 70);

    // Audience Applause & Tug-of-War Gauge
    const barW = 440;
    const barH = 14;
    const barX = this.width / 2 - barW / 2;
    const barY = 86;
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
    ctx.fillText(`Audience Favor: ${Math.round(comp.audienceApplause)}%  |  Measure ${comp.currentMeasure} / ${comp.totalMeasures}`, this.width / 2, 115);

    // Left Stage: Player's Ensemble
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Your Ensemble (Score: ${comp.playerScore})`, 100, 155);

    state.ensemble.members.forEach((m, idx) => {
      this.drawPixelMusician(ctx, 120 + idx * 75, 235, m, state.time, idx === 0 ? state.customization : undefined, 'right');
      this.drawPixelPet(ctx, 140 + idx * 75, 275, m.pet, state.time, idx === 0 ? state.customization?.petTint : undefined, 'right');
    });

    // Right Stage: Rival Ensemble
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${comp.rival.name} (Score: ${comp.rivalScore})`, this.width - 100, 155);

    comp.rival.members.forEach((m, idx) => {
      if (comp.isPianistDuel) {
        const rx = this.width - 200 - idx * 75;
        const ry = 235;
        ctx.save();
        ctx.font = '36px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎹', rx - 20, ry);
        ctx.restore();
        this.drawPixelMusician(ctx, rx + 15, ry, m, state.time, undefined, 'left');
      } else {
        this.drawPixelMusician(ctx, this.width - 180 - idx * 75, 235, m, state.time, undefined, 'left');
        this.drawPixelPet(ctx, this.width - 200 - idx * 75, 275, m.pet, state.time, undefined, 'left');
      }
    });

    // ✨ MAESTRO FLOW GAUGE & PARTICLES ✨
    const flowVal = comp.maestroFlow !== undefined ? comp.maestroFlow : 50;
    const flowW = Math.min(540, this.width - 80);
    const flowH = 18;
    const flowX = this.width / 2 - flowW / 2;
    const flowY = 296;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(flowX, flowY, flowW, flowH, 9);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const flowFill = (flowVal / 100) * flowW;
    const flowGrad = ctx.createLinearGradient(flowX, flowY, flowX + flowW, flowY);
    flowGrad.addColorStop(0, '#eab308');
    flowGrad.addColorStop(0.5, '#fde047');
    flowGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = flowGrad;
    ctx.beginPath();
    ctx.roundRect(flowX, flowY, Math.max(8, flowFill), flowH, 9);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const flowMult = (1.0 + (flowVal / 100) * 0.8).toFixed(2);
    ctx.fillText(`✨ MAESTRO FLOW: ${Math.round(flowVal)}%  •  Flow Resonance: ${flowMult}x ✨`, this.width / 2, flowY + 13);

    // Floating Golden Particles
    if (flowVal > 20) {
      const numParticles = Math.min(25, Math.floor((flowVal / 100) * 30));
      ctx.save();
      for (let i = 0; i < numParticles; i++) {
        const px = this.width / 2 + Math.sin(i * 14.7 + state.time * 2.5) * (240 + (i % 6) * 50);
        const py = 690 - ((state.time * 80 + i * 40) % 360);
        const alpha = Math.sin((state.time * 3 + i) % Math.PI);
        const size = 2 + (i % 3);
        ctx.fillStyle = `rgba(250, 204, 21, ${Math.max(0, alpha * 0.8)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 🎻 SECTION CUE LANES (Conducting Control Grid)
    const gap = Math.min(15, Math.max(8, (this.width - 600) / 16));
    const laneW = Math.min(260, (this.width - 60 - gap * 3) / 4);
    const laneH = 78;
    const startX = (this.width - (laneW * 4 + gap * 3)) / 2;
    const startY = 324;

    const sectionConfigs: { sec: InstrumentSection; icon: string; name: string; key: string; color: string; bg: string }[] = [
      { sec: 'strings', icon: '🎻', name: 'STRINGS', key: '[1 / D]', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
      { sec: 'woodwinds', icon: '🪈', name: 'WOODWINDS', key: '[2 / F]', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
      { sec: 'brass', icon: '🎺', name: 'BRASS', key: '[3 / J]', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      { sec: 'percussion', icon: '🥁', name: 'PERCUSSION', key: '[4 / K]', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' }
    ];

    sectionConfigs.forEach((cfg, idx) => {
      const lx = startX + idx * (laneW + gap);
      const isCueActive = comp.activeSectionCue && comp.activeSectionCue.section === cfg.sec;
      const bal = comp.sectionBalance ? (comp.sectionBalance[cfg.sec] ?? 75) : 75;

      ctx.save();
      // Lane Housing
      ctx.fillStyle = isCueActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(lx, startY, laneW, laneH, 10);
      ctx.fill();

      if (isCueActive) {
        const pulse = Math.sin(state.time * 10) * 1.5;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 12 + pulse * 4;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3 + pulse;
      } else {
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = 1.5;
      }
      ctx.stroke();

      // Top Urgency Countdown Indicator if cue active
      if (isCueActive && comp.activeSectionCue) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(lx + 6, startY + 4, (laneW - 12) * Math.max(0, comp.activeSectionCue.urgency), 3);
      }

      // Section Header (Emoji + Name + Key)
      ctx.fillStyle = cfg.color;
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${cfg.icon} ${cfg.name}`, lx + 10, startY + 22);

      ctx.fillStyle = isCueActive ? '#fde047' : '#94a3b8';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(cfg.key, lx + laneW - 10, startY + 22);

      // Cue Prompt Label or Balance Status
      ctx.textAlign = 'left';
      if (isCueActive && comp.activeSectionCue) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText(`⚡ ${comp.activeSectionCue.label}`, lx + 10, startY + 40);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`Intonation: ${bal}%`, lx + 10, startY + 40);
      }

      // Section Balance Mini-Gauge
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(lx + 10, startY + 54, laneW - 20, 8);
      ctx.fillStyle = cfg.color;
      ctx.fillRect(lx + 10, startY + 54, (laneW - 20) * (bal / 100), 8);
      ctx.restore();
    });

    // ⚔️ SECTION ACTIONS (Matching Action Selection for Active Section)
    const activeSec = comp.activeAttackingSection || 'strings';
    const sectionActions = SECTION_ACTIONS[activeSec] || SECTION_ACTIONS.strings;
    const actionCardY = 408;
    const actionCardH = 46;

    sectionActions.forEach((act, actIdx) => {
      const ax = startX + actIdx * (laneW + gap);
      const isHovered = this.mousePos ? (this.mousePos.x >= ax && this.mousePos.x <= ax + laneW && this.mousePos.y >= actionCardY && this.mousePos.y <= actionCardY + actionCardH) : false;

      ctx.save();
      ctx.fillStyle = isHovered ? 'rgba(30, 58, 138, 0.95)' : 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(ax, actionCardY, laneW, actionCardH, 8);
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = isHovered ? 2 : 1.2;
      ctx.stroke();

      // Action Title & Icon
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${actIdx + 1}] ${act.icon} ${act.name}`, ax + 8, actionCardY + 17);

      // Power / Effect Tag
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`⚡ Pwr:${act.power}`, ax + laneW - 8, actionCardY + 17);

      // Description
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.textAlign = 'left';
      const desc = act.description.length > 36 ? act.description.slice(0, 34) + '...' : act.description;
      ctx.fillText(desc, ax + 8, actionCardY + 34);

      ctx.restore();
    });

    // 🎵 THE CONDUCTING PODIUM & BATON SWEEP
    const meterW = Math.min(560, this.width - 80);
    const meterH = 22;
    const meterX = this.width / 2 - meterW / 2;
    const meterY = 480;

    // Track Housing
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.roundRect(meterX - 10, meterY - 18, meterW + 20, meterH + 36, 12);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Conductor's Podium Platform
    const podiumW = Math.min(320, this.width - 100);
    const podiumH = 32;
    const podiumX = this.width / 2 - podiumW / 2;
    const podiumY = Math.min(642, this.height - 46);
    ctx.fillStyle = '#261208';
    ctx.beginPath();
    ctx.roundRect(podiumX, podiumY, podiumW, podiumH, 8);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Podium Music Stand Graphic
    ctx.fillStyle = '#78350f';
    ctx.fillRect(this.width / 2 - 4, podiumY - 18, 8, 18);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(this.width / 2 - 18, podiumY - 32);
    ctx.lineTo(this.width / 2 + 18, podiumY - 32);
    ctx.lineTo(this.width / 2 + 14, podiumY - 18);
    ctx.lineTo(this.width / 2 - 14, podiumY - 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Meter Background Groove
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(meterX, meterY, meterW, meterH, 6);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Audience Applause / Dynamic Flow Fill
    const podiumMeterFill = Math.min(meterW, Math.max(0, (comp.audienceApplause / 100) * meterW));
    if (podiumMeterFill > 0) {
      const flowGrad = ctx.createLinearGradient(meterX, 0, meterX + meterW, 0);
      flowGrad.addColorStop(0, '#10b981');
      flowGrad.addColorStop(0.5, '#3b82f6');
      flowGrad.addColorStop(1, '#a855f7');
      ctx.fillStyle = flowGrad;
      ctx.beginPath();
      ctx.roundRect(meterX, meterY, podiumMeterFill, meterH, 6);
      ctx.fill();
    }

    // Dynamic Sweet Spot Zone
    const sweetCenter = comp.sweetSpotCenter;
    const sweetWidth = meterW * (comp.sweetSpotWidth || 0.15);
    const sweetLeft = Math.max(meterX, meterX + sweetCenter * meterW - sweetWidth / 2);
    const sweetRight = Math.min(meterX + meterW, sweetLeft + sweetWidth);

    ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
    ctx.fillRect(sweetLeft, meterY, sweetRight - sweetLeft, meterH);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(sweetLeft, meterY - 1, sweetRight - sweetLeft, meterH + 2);

    // Dynamic Cadence Downbeat Needle
    const tempoBPM = comp.playerPiece.bpm || 120;
    const needleNormalized = state.time > 0
      ? Math.abs(((state.time * (tempoBPM / 60) * 0.8) % 2) - 1)
      : comp.sweetSpotCenter;
    const needleX = meterX + needleNormalized * meterW;

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.fillRect(needleX - 2, meterY - 4, 4, meterH + 8);
    ctx.shadowBlur = 0;

    // Downbeat Indicator Triangle
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(needleX, meterY);
    ctx.lineTo(needleX + 6, meterY - 5);
    ctx.lineTo(needleX - 6, meterY - 5);
    ctx.closePath();
    ctx.fill();

    // 🪄 Expressive Conducting Baton Sweep
    ctx.save();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, podiumY - 22);
    ctx.lineTo(needleX, meterY + meterH / 2);
    ctx.stroke();

    // Baton wooden handle
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(this.width / 2, podiumY - 22);
    const handleEndX = this.width / 2 + (needleX - this.width / 2) * 0.2;
    const handleEndY = (podiumY - 22) + ((meterY + meterH / 2) - (podiumY - 22)) * 0.2;
    ctx.lineTo(handleEndX, handleEndY);
    ctx.stroke();

    // Glowing Baton Tip Spark
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(needleX, meterY + meterH / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Feedback Text & Streak
    if (comp.lastFeedbackText) {
      const isGood = comp.lastFeedback === 'PERFECT' || comp.lastFeedback === 'GREAT';
      ctx.fillStyle = isGood ? '#fef08a' : (comp.lastFeedback === 'OK' ? '#fde047' : '#fca5a5');
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const streakStr = comp.comboStreak > 1 ? ` (Streak: ${comp.comboStreak}🔥)` : '';
      ctx.fillText(`${comp.lastFeedbackText}${streakStr}`, this.width / 2, meterY - 6);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎵 Conduct the Ensemble: Cue Sections & Time the Master Downbeat!', this.width / 2, meterY - 6);
    }

    // Recent Combat Log (Rendered safely in the buffer zone between meter and podium)
    if (comp.combatLog && comp.combatLog.length > 0) {
      const recentLogs = comp.combatLog.slice(-2);
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      recentLogs.forEach((logText, lIdx) => {
        ctx.fillText(logText, this.width / 2, 530 + lIdx * 14);
      });
    }

    // Interactive Action Controls Prompt
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎼 [${activeSec.toUpperCase()} TURN] Section Attack: [1-4] or Click Card  |  ⏱️ Cadence Downbeat: [SPACE / ENTER]`, this.width / 2, this.height - 12);
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
      const py = 800 - camY;
      const r = 160;

      // Solid Slate Cobblestone Plaza precisely centered at (1000, 800)
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();

      // East Promenade: Straight horizontal conduit from Central Plaza to East Gate at y: 740..860 (Center y=800)
      ctx.fillRect(1000 - camX, 740 - camY, 1000, 120);

      // Northwest Walkway to Academy & Forge (Symmetrically anchored to (1000, 800))
      ctx.beginPath();
      ctx.moveTo(920 - camX, 720 - camY);
      ctx.lineTo(380 - camX, 500 - camY);
      ctx.lineTo(730 - camX, 500 - camY);
      ctx.lineTo(980 - camX, 680 - camY);
      ctx.closePath();
      ctx.fill();

      // Southwest Walkway to Melodic Rose Tavern (Symmetrically anchored to (1000, 800))
      ctx.beginPath();
      ctx.moveTo(920 - camX, 880 - camY);
      ctx.lineTo(540 - camX, 1180 - camY);
      ctx.lineTo(620 - camX, 1220 - camY);
      ctx.lineTo(980 - camX, 920 - camY);
      ctx.closePath();
      ctx.fill();

      // Northeast Walkway to Conservatory Library (Symmetrically anchored to (1000, 800))
      ctx.beginPath();
      ctx.moveTo(1080 - camX, 720 - camY);
      ctx.lineTo(1370 - camX, 500 - camY);
      ctx.lineTo(1450 - camX, 540 - camY);
      ctx.lineTo(1020 - camX, 680 - camY);
      ctx.closePath();
      ctx.fill();

      // Southeast Walkway to Town Hall & Clocktower (Symmetrically anchored to (1000, 800))
      ctx.beginPath();
      ctx.moveTo(1080 - camX, 880 - camY);
      ctx.lineTo(1400 - camX, 1180 - camY);
      ctx.lineTo(1480 - camX, 1220 - camY);
      ctx.lineTo(1020 - camX, 920 - camY);
      ctx.closePath();
      ctx.fill();

      // Plaza Concentric Pavers centered at (1000, 800)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 120, 0, Math.PI * 2);
      ctx.stroke();

      // East Road Curbs at y: 740 and y: 860
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(1000 - camX, 740 - camY);
      ctx.lineTo(2000 - camX, 740 - camY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1000 - camX, 860 - camY);
      ctx.lineTo(2000 - camX, 860 - camY);
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
      // Central City Grand Velvet Cross-Concourse keyed with Central Square
      ctx.fillStyle = '#991b1b'; // Velvet runner
      // Vertical runner (North Gate y:0 to South Gate y:2000)
      ctx.fillRect(1120 - camX, 0 - camY, 160, 2000);
      // Horizontal runner (West Arch x:0 to East Gate x:2400)
      ctx.fillRect(0 - camX, 920 - camY, 2400, 160);
      
      // Central Square Plaza & Rotunda Dais Paving
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(1020 - camX, 820 - camY, 360, 360);
      ctx.beginPath();
      ctx.arc(1200 - camX, 1000 - camY, 150, 0, Math.PI * 2);
      ctx.fill();

      // Gold Braided Fringe
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(1114 - camX, 0 - camY, 6, 2000);
      ctx.fillRect(1280 - camX, 0 - camY, 6, 2000);
      ctx.fillRect(0 - camX, 914 - camY, 2400, 6);
      ctx.fillRect(0 - camX, 1080 - camY, 2400, 6);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.strokeRect(1020 - camX, 820 - camY, 360, 360);

    } else if (state.currentZone === 'west_wilderness' || state.currentZone === 'east_wilderness') {
      // E/W Highway (width: 800) + Complete North/South Ring Connector (height: 1800)
      ctx.fillStyle = 'rgba(180, 83, 9, 0.32)';
      ctx.fillRect(0 - camX, 840 - camY, 800, 120); // Central highway (to village / central city)
      ctx.fillRect(340 - camX, 0 - camY, 120, 1800); // Continuous North/South ring highway connecting neighbor wildernesses
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0 - camX, 840 - camY, 800, 120);
      ctx.strokeRect(340 - camX, 0 - camY, 120, 1800);

      // Highway Center Dashed Divider Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(0 - camX, 900 - camY);
      ctx.lineTo(800 - camX, 900 - camY);
      ctx.moveTo(400 - camX, 0 - camY);
      ctx.lineTo(400 - camX, 1800 - camY);
      ctx.stroke();
      ctx.restore();

      // Pavement Directional Guidance Markings
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⬆️ NORTH PASS (ECHO CANYON)', 400 - camX, 620 - camY);
      ctx.fillText('⬆️ NORTH PASS (ECHO CANYON)', 400 - camX, 220 - camY);
      ctx.fillText('⬇️ SOUTH PASS (RUMBLE GORGE)', 400 - camX, 1180 - camY);
      ctx.fillText('⬇️ SOUTH PASS (RUMBLE GORGE)', 400 - camX, 1580 - camY);

    } else if (state.currentZone === 'north_wilderness' || state.currentZone === 'south_wilderness') {
      // N/S Highway (height: 800) + Complete East/West Ring Connector (width: 1800)
      ctx.fillStyle = 'rgba(180, 83, 9, 0.32)';
      ctx.fillRect(840 - camX, 0 - camY, 120, 800); // Central highway (to citadel/peaks / central city)
      ctx.fillRect(0 - camX, 340 - camY, 1800, 120); // Continuous East/West ring highway connecting neighbor wildernesses
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(840 - camX, 0 - camY, 120, 800);
      ctx.strokeRect(0 - camX, 340 - camY, 1800, 120);

      // Highway Center Dashed Divider Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(900 - camX, 0 - camY);
      ctx.lineTo(900 - camX, 800 - camY);
      ctx.moveTo(0 - camX, 400 - camY);
      ctx.lineTo(1800 - camX, 400 - camY);
      ctx.stroke();
      ctx.restore();

      // Pavement Directional Guidance Markings
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⬅️ WEST PASS (LYRE VALLEY)', 520 - camX, 405 - camY);
      ctx.fillText('⬅️ WEST PASS (LYRE VALLEY)', 220 - camX, 405 - camY);
      ctx.fillText('➡️ EAST PASS (BREEZE GLADE)', 1280 - camX, 405 - camY);
      ctx.fillText('➡️ EAST PASS (BREEZE GLADE)', 1580 - camX, 405 - camY);
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
          draw: () => this.drawNPCEntity(ctx, npc, camX, camY, state.time, state)
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
      const isSecret = !!target.isSecret;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = isSecret ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = isSecret ? 2.5 : 2;
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 220, this.height - 85, 440, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSecret ? '#fbbf24' : '#38bdf8';
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

  private drawNPCEntity(ctx: CanvasRenderingContext2D, npc: WorldNPC, camX: number, camY: number, t: number, state?: GameState): void {
    const nx = npc.x - camX;
    const ny = npc.y - camY;

    const isSecret = !!npc.isSecret;
    const playerDist = state ? Math.hypot(npc.x - state.player.x, npc.y - state.player.y) : 999;
    const isDiscovered = state?.discoveredSecrets?.includes(npc.id);
    const isApproached = isDiscovered || playerDist < 120;

    // Draw subtle sparkling shimmer aura for secret celebrity NPCs
    if (isSecret) {
      ctx.save();
      const shimmerAlpha = 0.35 + 0.25 * Math.sin(t * 4);
      const radGrad = ctx.createRadialGradient(nx, ny - 6, 4, nx, ny - 6, 36);
      radGrad.addColorStop(0, `rgba(251, 191, 36, ${shimmerAlpha * 0.6})`);
      radGrad.addColorStop(0.5, `rgba(245, 158, 11, ${shimmerAlpha * 0.25})`);
      radGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(nx, ny - 6, 36, 0, Math.PI * 2);
      ctx.fill();

      // Floating sparkles around secret NPC
      for (let i = 0; i < 3; i++) {
        const angle = t * 2.5 + i * (Math.PI * 2 / 3);
        const dist = 22 + Math.sin(t * 3 + i * 2) * 6;
        const sx = nx + Math.cos(angle) * dist;
        const sy = ny - 6 + Math.sin(angle) * dist;
        ctx.fillStyle = '#fde047';
        ctx.font = '10px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', sx, sy);
      }
      ctx.restore();
    }

    if (isSecret && !isApproached) {
      // Mystery Silhouette until player approaches!
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(nx, ny + 24, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shadow silhouette
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(nx - 10, ny, 20, 16, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny - 10, 10, 0, Math.PI * 2);
      ctx.fill();

      // Glowing question mark
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('?', nx, ny - 4);
      ctx.restore();

      // Mystery label plate
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(nx - 45, ny - 38, 90, 20, 4);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ ??? ✨', nx, ny - 24);
      return;
    }

    if (npc.id === 'npc_pianist_busker' || npc.actionType === 'pianist_busking_duel') {
      // Grand Piano Sprite & Maestro Franz Busker
      ctx.save();
      ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎹', nx - 14, ny + 4);
      ctx.restore();

      if (npc.musicianData) {
        this.drawPixelMusician(ctx, nx + 14, ny, npc.musicianData, t, undefined, 'left');
        if (npc.musicianData.pet) {
          this.drawPixelPet(ctx, nx + 34, ny + 4, npc.musicianData.pet, t, undefined, 'left');
        }
      }

      // Floating musical notes
      const noteBounce = Math.sin(t * 3);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('♫', nx - 24, ny - 18 + noteBounce * 3);
      ctx.fillText('♪', nx + 2, ny - 24 - noteBounce * 2);

      const isNearby = (state?.nearbyInteractable && state.nearbyInteractable.id === npc.id) ||
                       (state ? Math.hypot(state.player.x - npc.x, state.player.y - npc.y) <= 80 : false);
      const isHovered = this.mousePos ? Math.hypot(this.mousePos.x - nx, this.mousePos.y - ny) <= 40 : false;
      if (isNearby || isHovered) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        const labelText = `🎹 ${npc.name}`;
        ctx.font = 'bold 12px "Inter", sans-serif';
        const labelW = ctx.measureText(labelText).width + 20;
        ctx.roundRect(nx - labelW / 2, ny - 38, labelW, 22, 6);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, nx, ny - 23);
      }
      return;
    }

    const isNearby = (state?.nearbyInteractable && state.nearbyInteractable.id === npc.id) ||
                     (state ? Math.hypot(state.player.x - npc.x, state.player.y - npc.y) <= 75 : false);
    const isHovered = this.mousePos ? Math.hypot(this.mousePos.x - nx, this.mousePos.y - ny) <= 36 : false;
    const showNameBox = isNearby || isHovered;

    if (npc.musicianData) {
      this.drawPixelMusician(ctx, nx, ny, npc.musicianData, t, undefined, npc.dir || 'down');
      if (npc.musicianData.pet) {
        this.drawPixelPet(ctx, nx + 24, ny + 4, npc.musicianData.pet, t, undefined, npc.dir || 'down');
      }
      if (showNameBox) {
        const displayName = isSecret ? `🌟 ${npc.name} 🌟` : npc.name;
        ctx.font = 'bold 12px "Inter", sans-serif';
        const labelW = ctx.measureText(displayName).width + 20;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = isSecret ? '#fbbf24' : '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(nx - labelW / 2, ny - 38, labelW, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isSecret ? '#fbbf24' : '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(displayName, nx, ny - 23);
      }

    } else if (npc.actionType === 'wild_harmonipet' && npc.wildPetData) {
      this.drawPixelPet(ctx, nx, ny, npc.wildPetData, t, undefined, npc.dir || 'down');
      if (showNameBox) {
        const displayName = `✨ ${npc.wildPetData.name}`;
        ctx.font = 'bold 11px "Inter", sans-serif';
        const labelW = ctx.measureText(displayName).width + 20;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(nx - labelW / 2, ny - 34, labelW, 20, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#a7f3d0';
        ctx.textAlign = 'center';
        ctx.fillText(displayName, nx, ny - 20);
      }

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
        paletteColor: npc.outfitColor || '#0284c7',
        outfitColor: npc.outfitColor,
        hairColor: npc.hairColor,
        hatStyle: npc.hatStyle,
        isKid: npc.isKid,
        instrumentId: 'none',
        instrumentName: 'None',
        section: 'none',
        isNonMusician: true,
        stats: { technique: 10, toneQuality: 10, tempoStability: 10, sightReading: 10 },
        level: 1,
        xp: 0
      } as any, t, undefined, npc.dir || 'down');

      if (showNameBox) {
        ctx.font = 'bold 12px "Inter", sans-serif';
        const labelW = ctx.measureText(npc.name).width + 20;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(nx - labelW / 2, ny - 38, labelW, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, nx, ny - 23);
      }
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
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 ${zone ? zone.name : 'Harmonia'}`, 18, 34);

    let nextPillX = 180;
    if (this.width >= 1000) {
      // Player Skill & Level Pill
      const player = state.ensemble.members[0];
      const avgSkill = player ? Math.round((player.stats.technique + player.stats.toneQuality + player.stats.tempoStability + player.stats.sightReading) / 4) : 10;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(nextPillX, 10, 180, 34, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`👤 Lv.${player?.level || 1} • Skill: ${avgSkill}`, nextPillX + 90, 32);
      nextPillX += 195;
    }

    if (this.width >= 1150) {
      // Ensemble Tier Badge
      const tierName = state.ensemble.tier.toUpperCase();
      const count = state.ensemble.members.length;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(nextPillX, 10, 165, 34, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🎼 [${tierName} • ${count}]`, nextPillX + 82, 32);
      nextPillX += 180;
    }

    // HarmoniPhone Shortcut Pill
    const unreadCount = state.phoneMessages ? state.phoneMessages.filter(m => !m.read).length : 0;
    const phonePillW = unreadCount > 0 ? 140 : 110;
    const phonePillX = Math.max(nextPillX, this.width - 450);
    if (this.width >= 700) {
      ctx.fillStyle = unreadCount > 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = unreadCount > 0 ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(phonePillX, 10, phonePillW, 34, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = unreadCount > 0 ? '#38bdf8' : '#94a3b8';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`📱 [P] Phone ${unreadCount > 0 ? `(${unreadCount} 🔴)` : ''}`, phonePillX + phonePillW / 2, 32);
    }

    // Currency Wallet & Reputation (Right aligned)
    const rep = state.ensemble.reputationStars || state.wallet.reputationStars || 0;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'right';
    const walletText = this.width >= 950
      ? `★ Rep: ${rep}★  |  💰 ${state.wallet.gold} Notes  |  ✨ ${state.wallet.inspirationSparks} Sparks`
      : `💰 ${state.wallet.gold} ♪  |  ✨ ${state.wallet.inspirationSparks}`;
    ctx.fillText(walletText, this.width - 18, 33);

    // 🎹 Concerto Accompaniment Active HUD Banner
    if (state.hasPianoAccompaniment) {
      const bannerW = Math.min(460, this.width - 60);
      const bannerH = 26;
      const bannerX = this.width / 2 - bannerW / 2;
      const bannerY = 60;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 6);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎹 Concerto Piano Accompaniment Active (+50% Score)', this.width / 2, bannerY + 18);
    }

    // Push Notification Toast Banner
    this.renderNotificationToast(state);

    // Transient Onboarding Motion Helper (Only shown during first 8 seconds of play)
    if (state.time < 8) {
      const alpha = Math.min(1, (8 - state.time) / 2);
      const helperY = state.nearbyInteractable ? this.height - 125 : this.height - 48;
      ctx.fillStyle = `rgba(15, 23, 42, ${0.85 * alpha})`;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(16, helperY, 260, 32, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🎮 Move: [W A S D] or [↑ ← ↓ →]', 26, helperY + 21);
    }
  }

  /* ---------------- DIALOGUE OVERLAY ---------------- */

  private renderDialogue(state: GameState): void {
    const ctx = this.ctx;
    const dia = state.dialogue;
    if (!dia) return;

    const boxW = Math.min(860, this.width - 40);
    const boxH = Math.min(150, this.height - 50);
    const boxX = (this.width - boxW) / 2;
    const boxY = this.height - boxH - 25;

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
      const fullName = obs.name || 'Gateway';
      const textW = ctx.measureText(fullName).width;
      if (textW <= signW - 36) {
        ctx.fillText(`${obs.signIcon || '🏛️'} ${fullName}`, gx + gw / 2, signY + 22);
      } else {
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText(obs.signIcon || '🏛️', gx + gw / 2, signY + 23);
      }

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
      const fullName = obs.name || 'Gateway';
      const textW = ctx.measureText(fullName).width;
      if (textW <= signW - 36) {
        ctx.fillText(`${obs.signIcon || '🏛️'} ${fullName}`, gx + gw / 2, signY + 23);
      } else {
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.fillText(obs.signIcon || '🏛️', gx + gw / 2, signY + 24);
      }
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
    const isKid = !!(m.isKid || (m as any).isKid || (m.title && m.title.toLowerCase().includes('kid')) || (m.title && m.title.toLowerCase().includes('student')) || m.name.includes('Little') || m.name.includes('Timmy') || m.name.includes('Pip') || m.name.includes('Young'));
    ctx.save();
    if (isKid) {
      ctx.translate(x, y + 12);
      ctx.scale(0.72, 0.72);
      ctx.translate(-x, -(y + 12));
    }

    const bob = Math.sin(t * 6) * 2;

    // Deterministic palette generation for unique characters
    const hash = (m.id || m.name || 'char').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const outfitPalettes = ['#38bdf8', '#0ea5e9', '#10b981', '#059669', '#f59e0b', '#d97706', '#8b5cf6', '#7c3aed', '#ec4899', '#f43f5e', '#64748b', '#0284c7', '#475569', '#2563eb'];
    const hairPalettes = ['#475569', '#1e293b', '#b45309', '#78350f', '#fde047', '#fef08a', '#e2e8f0', '#94a3b8', '#991b1b', '#065f46'];
    const hatOptions: ('none' | 'beret' | 'feather_cap' | 'maestro' | 'headband')[] = ['none', 'beret', 'feather_cap', 'headband', 'none', 'maestro', 'none'];

    const defaultOutfit = outfitPalettes[hash % outfitPalettes.length];
    const defaultHair = hairPalettes[(hash * 3) % hairPalettes.length];
    const defaultHat = hatOptions[(hash * 7) % hatOptions.length];

    const outfit = m.isPlayer && custom ? custom.outfitColor : (m.outfitColor || m.paletteColor || defaultOutfit);
    const hair = m.isPlayer && custom ? custom.hairColor : (m.hairColor || defaultHair);
    const hat = m.isPlayer && custom ? custom.hatStyle : (m.hatStyle || (m.isPlayer ? 'beret' : defaultHat));

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

    // Handheld Instrument - Only drawn for active musicians! (NEVER for non-musicians / parents)
    const isParentOrNonMusician = m.isNonMusician || 
      (m.title && (m.title.includes('Parent') || m.title.includes('Mom') || m.title.includes('Dad') || m.title.includes('Father') || m.title.includes('Mother'))) ||
      m.name.includes('Mama') || m.name.includes('Papa') || m.name.includes('Mrs.') || m.name.includes('Mr.');

    if (!isParentOrNonMusician && m.instrumentId && (m.instrumentId as string) !== 'none' && m.section && (m.section as string) !== 'none') {
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
      } else if (m.section === 'percussion') {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(instX - 4, y + 2 + bob, 8, 2);
        ctx.fillRect(instX - 2, y + 8 + bob, 8, 2);
      }
    }
    ctx.restore();
  }

  private drawPixelPet(ctx: CanvasRenderingContext2D, x: number, y: number, pet: Harmonipet, t: number, tint?: string, dir: 'up' | 'down' | 'left' | 'right' = 'down'): void {
    const hop = Math.abs(Math.sin(t * 6)) * 4;
    const bodyColor = tint || pet.color;

    if (ctx.save) ctx.save();
    if (ctx.translate) ctx.translate(x, y);

    // Soft Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const spriteType = pet.sprite ? pet.sprite.toLowerCase() : '';

    if (dir === 'left' && ctx.scale) {
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

    if (ctx.restore) ctx.restore();
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

    const isTuning = enc.phase === 'tuning';
    const isPercussion = enc.pet.section === 'percussion';

    // Background Gradient
    const bgGrad = ctx.createRadialGradient(this.width / 2, this.height / 2, 50, this.width / 2, this.height / 2, 700);
    if (isTuning) {
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(1, '#022c22');
    } else {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 1. Top Header: Title & Phase Badge (y: 16..65)
    ctx.fillStyle = isTuning ? '#6ee7b7' : '#fbbf24';
    ctx.font = 'bold 22px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(isTuning ? '🐾 Harmonipet Tuning & Ear Training' : '⚡ Harmonipet Rhythm Performance', this.width / 2, 28);

    const tagW = 280;
    const tagH = 22;
    const tagX = (this.width - tagW) / 2;
    const tagY = 38;
    ctx.fillStyle = isTuning ? 'rgba(56, 189, 248, 0.2)' : 'rgba(245, 158, 11, 0.25)';
    ctx.strokeStyle = isTuning ? '#38bdf8' : '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagW, tagH, 11);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isTuning ? '#38bdf8' : '#fbbf24';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.fillText(isTuning ? '🔧 TUNING MODE (No Score / Ear Training)' : '⚡ PERFORMANCE MODE (Timed Rhythm)', this.width / 2, tagY + 15);

    // 2. Left Battler: Player & Familiar (x: 30..250, y: 82..230)
    const player = state.ensemble.members[0];
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(30, 82, 220, 54, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(player ? player.name : 'Maestro', 45, 105);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText(player ? player.instrumentName : 'Violin', 45, 124);

    // Player Platform & Avatars (x: 140, y: 190)
    ctx.fillStyle = 'rgba(6, 78, 59, 0.5)';
    ctx.beginPath();
    ctx.ellipse(140, 190, 75, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    if (player) {
      ctx.font = '44px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.avatar, 115, 185);
      ctx.font = '34px "Inter", sans-serif';
      ctx.fillText(player.pet.sprite, 165, 188 + Math.cos(state.time * 4) * 4);
    }

    // 3. Right Battler: Wild Harmonipet (x: width-250..width-30, y: 82..230)
    const rightBoxX = this.width - 250;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = enc.pet.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rightBoxX, 82, 220, 54, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Wild ${enc.pet.name}`, rightBoxX + 15, 105);
    ctx.fillStyle = enc.pet.color;
    ctx.font = '12px "Inter", sans-serif';
    const rarityLabel = enc.pet.rarity ? ` • ${enc.pet.rarity.toUpperCase()}` : '';
    ctx.fillText(`${enc.pet.species}${rarityLabel}`, rightBoxX + 15, 124);

    // Wild Creature Platform & Sprite (x: width - 140, y: 190)
    ctx.fillStyle = 'rgba(6, 78, 59, 0.5)';
    ctx.beginPath();
    ctx.ellipse(this.width - 140, 190, 75, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '50px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const bounce = Math.sin(state.time * 4) * 6;
    ctx.fillText(enc.pet.sprite, this.width - 140, 183 + bounce);

    // 4. Center Midsection: Resonance Progress Bar (x: 270..width-270)
    const centerAvailableW = Math.max(260, this.width - 540);
    const barW = Math.min(500, centerAvailableW);
    const barH = 26;
    const barX = (this.width - barW) / 2;
    const barY = 82;

    // Background track
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 8);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (isTuning) {
      const revealedCount = enc.revealedSteps ? enc.revealedSteps.filter(Boolean).length : 0;
      const totalCount = enc.targetNoteIndices.length;
      const tuningFill = Math.min(barW, Math.max(0, (revealedCount / totalCount) * barW));
      if (tuningFill > 0) {
        const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        barGrad.addColorStop(0, '#0d9488');
        barGrad.addColorStop(1, '#14b8a6');
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(barX, barY, tuningFill, barH, 8);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🐾 Tones Discovered: ${revealedCount} / ${totalCount} (Ear Training — 0% Victory Score)`, this.width / 2, barY + 18);
    } else {
      const progressWidth = Math.min(barW, Math.max(0, (enc.resonanceMeter / 100) * barW));
      if (progressWidth > 0) {
        const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        if (enc.resonanceMeter < 40) {
          barGrad.addColorStop(0, '#ef4444');
          barGrad.addColorStop(1, '#f97316');
        } else if (enc.resonanceMeter < 75) {
          barGrad.addColorStop(0, '#f59e0b');
          barGrad.addColorStop(1, '#eab308');
        } else {
          barGrad.addColorStop(0, '#10b981');
          barGrad.addColorStop(1, '#06b6d4');
        }
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(barX, barY, progressWidth, barH, 8);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Harmonic Resonance: ${enc.resonanceMeter}%`, this.width / 2, barY + 18);
    }

    // Subtitle instruction
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isTuning 
      ? `Test buttons [1]-[4] freely to discover each tone in the sequence with zero risk!`
      : `Play the full ${enc.targetNoteIndices.length}-note phrase in tempo with the rhythm sweet spot!`,
      this.width / 2, 118);

    // Control Buttons Row (Replay & Phase Switch) at y: 138, h: 34
    const btnW = Math.min(210, (centerAvailableW - 20) / 2);
    const btnH = 34;
    const gapBtn = 16;
    const totalBtnW = btnW * 2 + gapBtn;
    const repX = (this.width - totalBtnW) / 2;
    const repY = 138;
    const phaseX = repX + btnW + gapBtn;

    // [R] Replay Button
    ctx.fillStyle = enc.isPlayingMelody ? 'rgba(245, 158, 11, 0.25)' : 'rgba(14, 165, 233, 0.25)';
    ctx.strokeStyle = enc.isPlayingMelody ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(repX, repY, btnW, btnH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = enc.isPlayingMelody ? '#fbbf24' : '#38bdf8';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(enc.isPlayingMelody ? '🎶 Playing Call...' : '👂 [R] Replay Tune', repX + btnW / 2, repY + 22);

    // Phase Switch Button
    ctx.fillStyle = isTuning ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.25)';
    ctx.strokeStyle = isTuning ? '#34d399' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(phaseX, repY, btnW, btnH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isTuning ? '#6ee7b7' : '#38bdf8';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText(isTuning ? '✨ [SPACE] Begin Performance' : '🔧 [T] Back to Tuning', phaseX + btnW / 2, repY + 22);

    // 5. Melody Sequence Call & Response Display at y: 186, h: 38
    let noteNames = ['C4', 'E4', 'G4', 'C5'];
    if (isPercussion) {
      const pInst = enc.pet.instrumentId;
      if (pInst === 'typewriter') {
        noteNames = ['Clack', 'Space', 'Return', 'Bell'];
      } else if (pInst === 'cannon') {
        noteNames = ['Fuse', 'Powder', 'Echo', 'Cannon'];
      } else if (pInst === 'timpani') {
        noteNames = ['Low D', 'Low F', 'Low A', 'High D'];
      } else if (pInst === 'marimba') {
        noteNames = ['C4', 'E4', 'G4', 'C5'];
      } else {
        noteNames = ['Hi-Hat', 'Snare', 'Kick', 'Crash'];
      }
    }
    
    const targetPills = enc.targetNoteIndices.map((nIdx, idx) => {
      const isRevealed = enc.revealedSteps && enc.revealedSteps[idx];
      const isCurrent = idx === enc.currentStep;
      const text = isRevealed 
        ? `${noteNames[nIdx]} ♪` 
        : (isCurrent ? `[ ? ]` : `?`);
      return { text, isRevealed, isCurrent };
    });

    const seqW = Math.min(520, Math.max(340, enc.targetNoteIndices.length * 80 + 100));
    const seqH = 38;
    const seqX = (this.width - seqW) / 2;
    const seqY = 186;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = isTuning ? '#34d399' : '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(seqX, seqY, seqW, seqH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isTuning ? '#6ee7b7' : '#fbbf24';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(isPercussion ? '🥁 Phrase:' : '🎵 Melody:', seqX + 12, seqY + 24);

    const pillStartX = seqX + 85;
    const pillGap = 6;
    const pillW = (seqW - 98 - (targetPills.length - 1) * pillGap) / targetPills.length;

    targetPills.forEach((p, idx) => {
      const px = pillStartX + idx * (pillW + pillGap);
      ctx.fillStyle = p.isRevealed ? 'rgba(16, 185, 129, 0.4)' : (p.isCurrent ? 'rgba(245, 158, 11, 0.25)' : 'rgba(30, 41, 59, 0.6)');
      ctx.strokeStyle = p.isRevealed ? '#34d399' : (p.isCurrent ? '#fbbf24' : '#475569');
      ctx.lineWidth = p.isCurrent || p.isRevealed ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(px, seqY + 5, pillW, 28, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = p.isRevealed ? '#a7f3d0' : (p.isCurrent ? '#fef08a' : '#94a3b8');
      ctx.font = p.isCurrent || p.isRevealed ? 'bold 11px "Inter", sans-serif' : '11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, px + pillW / 2, seqY + 23);
    });

    // 6. Timing Bar (Performance Phase only) at y: 236, h: 14
    if (!isTuning) {
      const rhythmW = Math.min(380, centerAvailableW - 40);
      const rhythmH = 14;
      const rhythmX = (this.width - rhythmW) / 2;
      const rhythmY = 236;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rhythmX, rhythmY, rhythmW, rhythmH, 7);
      ctx.fill();
      ctx.stroke();

      // Sweet spot center
      const swCenter = enc.sweetSpotCenter ?? 0.5;
      const swW = rhythmW * 0.3;
      const swX = rhythmX + (swCenter * rhythmW) - (swW / 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.fillRect(Math.max(rhythmX, swX), rhythmY, Math.min(swW, rhythmW), rhythmH);

      // Sweep indicator
      const tempoBPM = 120;
      const sweepPos = state.time > 0 ? Math.abs(((state.time * (tempoBPM / 60) * 0.8) % 2) - 1) : 0.5;
      const sweepX = rhythmX + sweepPos * rhythmW;
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(sweepX - 2, rhythmY - 3, 4, rhythmH + 6);
    }

    // 7. Status Banner at y: 268 / 245
    const statusY = isTuning ? 245 : 268;
    if (enc.lastFeedbackText) {
      ctx.fillStyle = enc.lastFeedback === 'PERFECT' ? '#34d399' : (enc.lastFeedback === 'DISSONANCE' ? '#f87171' : '#38bdf8');
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(enc.lastFeedbackText, this.width / 2, statusY);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isTuning 
        ? 'Tuning Mode: Press [1]-[4] to discover notes freely.' 
        : `Attempts Remaining: ${enc.attemptsRemaining} / 5  •  Execute full phrase in rhythm!`, 
        this.width / 2, statusY);
    }

    // 8. Note Action Buttons at y: 285 / 295, h: 72
    let notes: { label: string; sub: string }[] = [];
    if (isPercussion) {
      const pInst = enc.pet.instrumentId;
      if (pInst === 'typewriter') {
        notes = [
          { label: '[1] Key Clack', sub: 'Mechanical Strike ⌨️' },
          { label: '[2] Space Bar', sub: 'Solid Thud 🔲' },
          { label: '[3] Carriage Return', sub: 'Slide & Zip ⚙️' },
          { label: '[4] Margin Bell', sub: 'Silver Chime 🔔' }
        ];
      } else if (pInst === 'cannon') {
        notes = [
          { label: '[1] Fuse Spark', sub: 'Ignition Hiss ⚡' },
          { label: '[2] Powder Pack', sub: 'Damped Punch 💣' },
          { label: '[3] Canyon Echo', sub: 'Low Rumble 🌋' },
          { label: '[4] Artillery Blast', sub: 'Sub-Bass Boom 💥' }
        ];
      } else if (pInst === 'timpani') {
        notes = [
          { label: '[1] Low D (Root)', sub: 'Kettledrum Pulse 🥁' },
          { label: '[2] Low F (Third)', sub: 'Kettledrum Tone 🪘' },
          { label: '[3] Low A (Fifth)', sub: 'Deep Resonance 🌊' },
          { label: '[4] High D (Octave)', sub: 'Dramatic Surge ⚡' }
        ];
      } else if (pInst === 'marimba') {
        notes = [
          { label: '[1] C4 (Low Bar)', sub: 'Rosewood Root 🪵' },
          { label: '[2] E4 (Mid Bar)', sub: 'Warm Third 🎶' },
          { label: '[3] G4 (High Bar)', sub: 'Fifth Consonance ✨' },
          { label: '[4] C5 (Top Bar)', sub: 'Bright Octave 🌟' }
        ];
      } else {
        notes = [
          { label: '[1] Hi-Hat Tap', sub: 'Crisp Chick 🥁' },
          { label: '[2] Snare Snap', sub: 'Acoustic Pop 💥' },
          { label: '[3] Bass Kick', sub: 'Deep Thump 🪘' },
          { label: '[4] Crash Splash', sub: 'Resonant Cymbal ✨' }
        ];
      }
    } else {
      notes = [
        { label: '[1] C4 (Root)', sub: 'Foundation 🎵' },
        { label: '[2] E4 (Third)', sub: 'Harmonic Warmth 🎶' },
        { label: '[3] G4 (Fifth)', sub: 'Consonance ✨' },
        { label: '[4] C5 (Octave)', sub: 'Overtone Surge 🌟' }
      ];
    }

    const cardGap = 14;
    const cardW = Math.min(195, (this.width - 80 - cardGap * 3) / 4);
    const cardH = 70;
    const startX = (this.width - (cardW * 4 + cardGap * 3)) / 2;
    const cardY = isTuning ? 275 : 295;

    notes.forEach((n, idx) => {
      const cx = startX + idx * (cardW + cardGap);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = isTuning ? '#38bdf8' : '#34d399';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isTuning ? '#7dd3fc' : '#6ee7b7';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, cx + cardW / 2, cardY + 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText(n.sub, cx + cardW / 2, cardY + 50);
    });

    // 9. Parent Mentor Guidance Card (y: cardY + cardH + 16, h: 50)
    const tipW = Math.min(740, this.width - 60);
    const tipH = 48;
    const tipX = (this.width - tipW) / 2;
    const tipY = cardY + cardH + 15;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tipX, tipY, tipW, tipH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const mentorTip = isTuning 
      ? '👩‍👧 Mama Aria: "Take your time sweetie! Tuning mode won\'t count towards victory, but you can find every note safely!"'
      : '👩‍👧 Mama Aria: "Now perform with feeling! Hit the notes right when the yellow line crosses the green zone!"';
    ctx.fillText(mentorTip, this.width / 2, tipY + 28);
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
    ctx.roundRect(40, 25, this.width - 80, 195, 16);
    ctx.fill();
    ctx.stroke();

    const hearts = '❤️ '.repeat(ch.lifelinesRemaining) + '🖤 '.repeat(Math.max(0, ch.maxLifelines - ch.lifelinesRemaining));
    const modeTag = ch.isPracticePreview ? '📖 [STUDY PREVIEW MODE] ' : '';
    const rewardTag = ch.isPracticePreview ? 'Practice Study (No Exam Risk)' : `Target Reward: +${ch.rewardSparks || 25} Sparks ✨, +${ch.rewardSightReading || 3} RDG 📖`;

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎼 ${modeTag}${ch.title ? ch.title.toUpperCase() : 'MUSIC THEORY DRILL'}`, this.width / 2, 52);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText(q.prompt, this.width / 2, 88);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillText(q.subtext, this.width / 2, 126);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.fillText(`Lifelines: ${hearts.trim()} (${ch.lifelinesRemaining}/${ch.maxLifelines}) | Q${ch.currentQuestionIndex + 1}/${ch.questions.length} | Score: ${ch.score} | ${rewardTag}`, this.width / 2, 180);

    // If audio drill, show Replay Button
    if (q.notesToPlay && q.notesToPlay.length > 0) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 120, 235, 240, 40, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillText('🔊 Replay Pitch [R]', this.width / 2, 260);
    }

    // 4 Option Cards
    const optGap = 16;
    const optW = Math.min(460, (this.width - 80 - optGap) / 2);
    const startY = q.notesToPlay ? 295 : 240;
    const optH = Math.min(75, Math.max(54, (this.height - startY - 35) / 2));
    const gapY = 14;

    q.options.forEach((optText, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ox = col === 0 ? this.width / 2 - optW - optGap / 2 : this.width / 2 + optGap / 2;
      const oy = startY + row * (optH + gapY);

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ox, oy, optW, optH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${idx + 1}]`, ox + 16, oy + optH / 2 + 6);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText(optText, ox + 52, oy + optH / 2 + 6);
    });
  }

  /* ---------------- IN-WORLD INSTRUMENT QUICK-WHEEL OVERLAY ---------------- */

  private renderQuickWheel(state: GameState): void {
    const ctx = this.ctx;
    const unlocked = state.proficiency.unlockedInstruments;
    if (!unlocked || unlocked.length === 0) return;

    // Dark backdrop overlay with blur aesthetic
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;
    const R = Math.min(180, this.height * 0.26);
    const currentInst = state.ensemble.members[0]?.instrumentId;

    // Outer guide circle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // Center Hub
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUICK-WHEEL', cx, cy - 14);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText('Press [Tab] / [Q]', cx, cy + 8);
    ctx.fillText('or click to equip', cx, cy + 26);

    const N = unlocked.length;
    let hoveredInst: any = null;

    unlocked.forEach((instId, i) => {
      const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
      const slotX = cx + Math.cos(angle) * R;
      const slotY = cy + Math.sin(angle) * R;
      const isCurrent = instId === currentInst;
      const isHovered = Math.hypot(this.mousePos.x - slotX, this.mousePos.y - slotY) <= 40;
      const info = ALL_INSTRUMENTS_INFO[instId];

      if (isHovered && info) {
        hoveredInst = { id: instId, ...info };
      }

      // Connecting spoke line
      ctx.strokeStyle = isHovered ? '#fbbf24' : (isCurrent ? '#34d399' : 'rgba(56, 189, 248, 0.3)');
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 75, cy + Math.sin(angle) * 75);
      ctx.lineTo(slotX - Math.cos(angle) * 36, slotY - Math.sin(angle) * 36);
      ctx.stroke();

      // Slot Circle
      ctx.fillStyle = isHovered ? '#0284c7' : (isCurrent ? '#065f46' : '#1e293b');
      ctx.strokeStyle = isHovered ? '#fbbf24' : (isCurrent ? '#34d399' : '#38bdf8');
      ctx.lineWidth = isHovered || isCurrent ? 3 : 2;
      ctx.beginPath();
      ctx.arc(slotX, slotY, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Avatar
      ctx.font = '24px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(info?.avatar || '🎵', slotX, slotY - 2);

      // Label below
      ctx.font = isCurrent ? 'bold 12px "Inter", sans-serif' : '11px "Inter", sans-serif';
      ctx.fillStyle = isCurrent ? '#34d399' : '#f8fafc';
      ctx.fillText(info?.name ? (info.name.length > 14 ? info.name.substring(0, 12) + '..' : info.name) : instId, slotX, slotY + 48);

      if (isCurrent) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 9px "Inter", sans-serif';
        ctx.fillText('EQUIPPED', slotX, slotY + 60);
      }
    });

    // Hover tooltip banner at bottom
    if (hoveredInst) {
      const tipW = Math.min(600, this.width - 40);
      const tipH = 58;
      const tipX = (this.width - tipW) / 2;
      const tipY = this.height - tipH - 16;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, tipH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${hoveredInst.avatar} ${hoveredInst.name} (${hoveredInst.section.toUpperCase()})`, tipX + 16, tipY + 22);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(hoveredInst.description, tipX + 16, tipY + 42);
    }
  }

  /* ---------------- PUSH NOTIFICATION TOAST ---------------- */

  private renderNotificationToast(state: GameState): void {
    const notif = state.activeNotification;
    if (!notif || notif.timer <= 0) return;

    const ctx = this.ctx;
    const toastW = Math.min(560, this.width - 40);
    const toastH = 64;
    const toastX = (this.width - toastW) / 2;
    const toastY = state.hasPianoAccompaniment ? 96 : 64;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.beginPath();
    ctx.roundRect(toastX, toastY, toastW, toastH, 12);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Icon Circle
    ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
    ctx.beginPath();
    ctx.arc(toastX + 34, toastY + 32, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '22px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(notif.icon || '📱', toastX + 34, toastY + 40);

    // Title
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(notif.title, toastX + 68, toastY + 26);

    // Message
    ctx.fillStyle = '#f8fafc';
    ctx.font = '13px "Inter", sans-serif';
    const maxChars = 62;
    const msgText = notif.message.length > maxChars ? notif.message.substring(0, maxChars - 3) + '...' : notif.message;
    ctx.fillText(msgText, toastX + 68, toastY + 46);

    // Countdown bar
    const progress = Math.max(0, Math.min(1, notif.timer / 5.0));
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(toastX + 12, toastY + toastH - 3, (toastW - 24) * progress, 2);
  }

  /* ---------------- SMARTPHONE ("HARMONIPHONE") MODAL ---------------- */

  private renderPhoneMenu(state: GameState): void {
    const ctx = this.ctx;
    const phoneW = Math.min(520, this.width - 24);
    const phoneH = Math.min(620, this.height - 20);
    const phoneX = (this.width - phoneW) / 2;
    const phoneY = (this.height - phoneH) / 2;

    // Dark screen backdrop
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Outer Phone Chassis (Metallic Titanium)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 28);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Glass Display Bezel
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(phoneX + 10, phoneY + 10, phoneW - 20, phoneH - 20, 20);
    ctx.fill();

    // Dynamic Island / Camera Notch
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(phoneX + phoneW / 2 - 50, phoneY + 14, 100, 18, 9);
    ctx.fill();

    // Status Bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📶 5G', phoneX + 24, phoneY + 28);
    ctx.textAlign = 'right';
    ctx.fillText('9:41 AM  •  🔋 98%', phoneX + phoneW - 24, phoneY + 28);

    // App Navigation Bar (6 Tabs)
    const activeTab = state.phoneTab || 'messages';
    const tabs = [
      { id: 'messages', name: 'Msgs', icon: '💬' },
      { id: 'ensemble', name: 'Band', icon: '👥' },
      { id: 'repertoire', name: 'Scores', icon: '🎼' },
      { id: 'quests', name: 'Quests', icon: '📜' },
      { id: 'calendar', name: 'Gigs', icon: '📅' },
      { id: 'dex', name: 'Pets', icon: '🐾' }
    ] as const;

    const tabW = (phoneW - 40) / tabs.length;
    const tabY = phoneY + 44;
    const tabH = 32;

    tabs.forEach((t, idx) => {
      const tx = phoneX + 20 + idx * tabW;
      const isActive = activeTab === t.id;
      const unreadBadge = t.id === 'messages' && state.phoneMessages && state.phoneMessages.some(m => !m.read);

      ctx.fillStyle = isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)';
      ctx.strokeStyle = isActive ? '#38bdf8' : '#334155';
      ctx.lineWidth = isActive ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(tx, tabY, tabW - 4, tabH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isActive ? '#38bdf8' : '#94a3b8';
      ctx.font = isActive ? 'bold 10px "Inter", sans-serif' : '10px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${t.icon} ${t.name}`, tx + (tabW - 4) / 2, tabY + 20);

      if (unreadBadge) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(tx + tabW - 8, tabY + 6, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Content Display Area
    const contentX = phoneX + 20;
    const contentY = phoneY + 84;
    const contentW = phoneW - 40;
    const contentH = phoneH - 135;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(contentX, contentY, contentW, contentH, 12);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Render App Specific Content
    if (activeTab === 'messages') {
      const msgs = state.phoneMessages || [];
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📨 Messages & HarmoniRumors', contentX + 16, contentY + 24);

      if (msgs.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 13px "Inter", sans-serif';
        ctx.fillText('No messages in your inbox.', contentX + 16, contentY + 60);
      } else {
        const itemH = 88;
        msgs.slice(0, 4).forEach((m, idx) => {
          const my = contentY + 36 + idx * (itemH + 8);
          ctx.fillStyle = m.read ? 'rgba(30, 41, 59, 0.5)' : 'rgba(30, 58, 138, 0.4)';
          ctx.strokeStyle = m.read ? '#334155' : (m.category === 'mom' ? '#f59e0b' : '#38bdf8');
          ctx.lineWidth = m.read ? 1 : 1.5;
          ctx.beginPath();
          ctx.roundRect(contentX + 10, my, contentW - 20, itemH, 8);
          ctx.fill();
          ctx.stroke();

          // Avatar & Sender
          ctx.font = '24px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(m.senderAvatar, contentX + 32, my + 34);

          ctx.textAlign = 'left';
          ctx.fillStyle = m.read ? '#cbd5e1' : '#38bdf8';
          ctx.font = 'bold 13px "Inter", sans-serif';
          ctx.fillText(m.sender, contentX + 56, my + 22);

          // Timestamp
          ctx.fillStyle = '#64748b';
          ctx.font = '10px "Inter", sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(m.timestamp, contentX + contentW - 20, my + 22);

          // Subject
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 12px "Inter", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(m.subject, contentX + 56, my + 38);

          // Body preview
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px "Inter", sans-serif';
          const snippet = m.body.length > 58 ? m.body.substring(0, 55) + '...' : m.body;
          ctx.fillText(snippet, contentX + 56, my + 54);
          if (m.body.length > 58) {
            const snippet2 = m.body.substring(55, 110) + (m.body.length > 110 ? '...' : '');
            ctx.fillText(snippet2, contentX + 56, my + 68);
          }
        });
      }
    } else if (activeTab === 'ensemble') {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`👥 Ensemble Roster (${state.ensemble.members.length} Active • ${state.ensemble.tier.toUpperCase()})`, contentX + 16, contentY + 24);

      const members = state.ensemble.members || [];
      const itemH = 62;
      members.slice(0, 6).forEach((m, idx) => {
        const my = contentY + 34 + idx * (itemH + 6);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = m.paletteColor || '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(contentX + 10, my, contentW - 20, itemH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '24px "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.avatar, contentX + 32, my + 36);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText(`${m.name} ${idx === 0 ? '👑 (You)' : ''}`, contentX + 56, my + 22);

        const secColor = m.section === 'strings' ? '#ec4899' : (m.section === 'woodwinds' ? '#06b6d4' : (m.section === 'brass' ? '#f59e0b' : '#a855f7'));
        ctx.fillStyle = secColor;
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText(`${m.section.toUpperCase()} • ${m.instrumentName} • Lv.${m.level}`, contentX + 56, my + 38);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`Pet: ${m.pet.name} (${m.pet.species})`, contentX + 56, my + 52);
      });
    } else if (activeTab === 'calendar') {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📅 Seasonal Gigs & Festival Circuit', contentX + 16, contentY + 24);

      const events = state.calendarEvents || [];
      const itemH = 68;
      events.slice(0, 5).forEach((ev, idx) => {
        const ey = contentY + 36 + idx * (itemH + 8);
        const isDone = state.completedEvents?.includes(ev.id);
        ctx.fillStyle = isDone ? 'rgba(6, 78, 59, 0.4)' : 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = isDone ? '#10b981' : '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(contentX + 10, ey, contentW - 20, itemH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDone ? '#34d399' : '#fbbf24';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${ev.name} ${isDone ? '✓ COMPLETED' : ''}`, contentX + 20, ey + 22);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(`📍 ${ev.venueName}  •  Reward: 💰${ev.rewardGold} Notes`, contentX + 20, ey + 40);
        ctx.fillText(ev.description.substring(0, 60) + '...', contentX + 20, ey + 56);
      });
    } else if (activeTab === 'quests') {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📜 Quest Journal & Objectives', contentX + 16, contentY + 24);

      const quests = state.quests || [];
      const itemH = 68;
      quests.slice(0, 5).forEach((q, idx) => {
        const qy = contentY + 36 + idx * (itemH + 8);
        ctx.fillStyle = q.completed ? 'rgba(6, 78, 59, 0.4)' : (state.activeQuestId === q.id ? 'rgba(30, 58, 138, 0.35)' : 'rgba(30, 41, 59, 0.6)');
        ctx.strokeStyle = q.completed ? '#10b981' : (state.activeQuestId === q.id ? '#38bdf8' : '#475569');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(contentX + 10, qy, contentW - 20, itemH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = q.completed ? '#34d399' : (state.activeQuestId === q.id ? '#38bdf8' : '#f8fafc');
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${q.title} ${q.completed ? '✓' : ''}`, contentX + 20, qy + 22);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(q.objective.substring(0, 65) + (q.objective.length > 65 ? '...' : ''), contentX + 20, qy + 40);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(`Reward: 💰 ${q.rewardGold} Notes  |  ✨ ${q.rewardSparks} Sparks`, contentX + 20, qy + 56);
      });
    } else if (activeTab === 'repertoire') {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🎼 Repertoire Sheet Music', contentX + 16, contentY + 24);

      const pieces = state.repertoire || [];
      const itemH = 68;
      pieces.slice(0, 5).forEach((p, idx) => {
        const py = contentY + 36 + idx * (itemH + 8);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = p.isMastered ? '#fbbf24' : '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(contentX + 10, py, contentW - 20, itemH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = p.isMastered ? '#fbbf24' : '#f8fafc';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${p.title} ${p.isMastered ? '👑 MASTERED' : ''}`, contentX + 20, py + 22);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(`Composer: ${p.composer}  •  Genre: ${p.genre}  •  ${p.bpm} BPM`, contentX + 20, py + 40);
        ctx.fillText(`Tier: ${p.minEnsembleTier.toUpperCase()}  •  Difficulty: ${'★'.repeat(p.difficulty)}`, contentX + 20, py + 56);
      });
    } else if (activeTab === 'dex') {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🐾 HarmoniDex Encyclopedia (${state.harmoniDex.filter(d => d.bonded).length} Bonded)`, contentX + 16, contentY + 24);

      const dex = state.harmoniDex || [];
      const itemH = 60;
      dex.slice(0, 6).forEach((d, idx) => {
        const dy = contentY + 34 + idx * (itemH + 6);
        ctx.fillStyle = d.bonded ? 'rgba(6, 78, 59, 0.4)' : (d.discovered ? 'rgba(30, 41, 59, 0.6)' : 'rgba(15, 23, 42, 0.4)');
        ctx.strokeStyle = d.bonded ? '#10b981' : (d.discovered ? '#38bdf8' : '#334155');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(contentX + 10, dy, contentW - 20, itemH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '26px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.discovered ? d.sprite : '❓', contentX + 34, dy + 38);

        ctx.textAlign = 'left';
        ctx.fillStyle = d.bonded ? '#34d399' : (d.discovered ? '#f8fafc' : '#64748b');
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillText(d.discovered ? `${d.name} (${d.species})` : '??? Unknown Creature', contentX + 60, dy + 24);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(d.discovered ? `Section: ${d.section.toUpperCase()}  •  ${d.instrumentName}  •  ${d.bonded ? '🤝 BONDED' : '👀 SEEN'}` : 'Explore the wilderness to discover', contentX + 60, dy + 44);
      });
    }

    // Bottom Navigation Bar & Close Button
    const closeBtnW = 200;
    const closeBtnH = 34;
    const closeBtnX = (this.width - closeBtnW) / 2;
    const closeBtnY = phoneY + phoneH - 46;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(closeBtnX, closeBtnY, closeBtnW, closeBtnH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✕ Close Phone [P]', closeBtnX + closeBtnW / 2, closeBtnY + 21);
  }
}
