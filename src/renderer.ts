// Harmonia: Opus of the Ensemble - 2D Canvas Renderer

import { GameState, Harmonipet, Musician, PlayerCustomization } from './types';
import { WORLD_ZONES, STARTER_OPTIONS, BATTLE_MOVES } from './data';

export class HarmoniaRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 1280;
  private height: number = 720;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public setSize(w: number, h: number): void {
    this.width = w;
    this.height = h;
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
    ctx.font = 'bold 28px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚔️ AUDITION DUEL: HARMONIC JAM SESSION 🎻', this.width / 2, 50);

    // Left: Player & Familiar
    const player = state.ensemble.members[0];
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${player.name} (${player.instrumentName})`, 100, 120);
    this.drawPixelMusician(ctx, 180, 260, player, state.time);
    this.drawPixelPet(ctx, 280, 280, player.pet, state.time);

    // Player Harmony Meter
    this.drawBar(ctx, 100, 140, 300, 24, battle.playerHarmonyMeter, 100, '#38bdf8', 'Harmony: ' + battle.playerHarmonyMeter + '%');
    // Harmony Points
    this.drawBar(ctx, 100, 175, 300, 16, battle.harmonyPoints, battle.maxHarmonyPoints, '#fbbf24', 'HP Points: ' + battle.harmonyPoints);

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
    this.drawPixelMusician(ctx, this.width - 240, 260, opp, state.time);
    this.drawPixelPet(ctx, this.width - 340, 280, opp.pet, state.time);

    // Opponent Resonance Meter
    this.drawBar(ctx, this.width - 400, 140, 300, 24, battle.opponentHarmonyMeter, 100, opp.paletteColor, 'Resonance: ' + battle.opponentHarmonyMeter + '%');

    if (battle.opponentStance !== 'normal') {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(`⚠️ [STANCE: ${battle.opponentStance.toUpperCase().replace('_', ' ')}]`, this.width - 400, 205);
    }

    // Middle: Battle Move Action Bar (4 Tactical Actions)
    const moves = [
      BATTLE_MOVES.counterpoint_weave,
      BATTLE_MOVES.vibrato_charm,
      BATTLE_MOVES.pianissimo_shield,
      BATTLE_MOVES.fortissimo_surge
    ];
    const moveW = 240;
    const moveH = 80;
    const moveStartX = (this.width - (moveW * 4 + 45)) / 2;
    const moveY = 460;

    moves.forEach((m, idx) => {
      const mx = moveStartX + idx * (moveW + 15);
      const isAffordable = battle.harmonyPoints >= m.harmonyCost;
      ctx.fillStyle = isAffordable ? '#1e293b' : 'rgba(30, 41, 59, 0.4)';
      ctx.strokeStyle = idx >= 2 ? (idx === 2 ? '#10b981' : '#f59e0b') : (isAffordable ? '#38bdf8' : '#64748b');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(mx, moveY, moveW, moveH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isAffordable ? '#f8fafc' : '#64748b';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`[${idx + 1}] ${m.name}`, mx + 12, moveY + 28);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(`Cost: ${m.harmonyCost} HP`, mx + 12, moveY + 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "Inter", sans-serif';
      this.wrapText(ctx, m.description, mx + 12, moveY + 64, moveW - 24, 14);
    });

    // Battle Log
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(100, 560, this.width - 200, 130, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '14px "Inter", sans-serif';
    ctx.textAlign = 'left';
    battle.log.slice(-4).forEach((logText, lIdx) => {
      ctx.fillText(`• ${logText}`, 120, 590 + lIdx * 25);
    });
  }

  /* ---------------- CONCERT COMPETITION ARENA ---------------- */

  private renderConcertCompetition(state: GameState): void {
    const ctx = this.ctx;
    const comp = state.competition;
    if (!comp) return;

    // Concert Hall Red Carpet & Stage
    ctx.fillStyle = '#2b0918';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 30px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 CONCERT COMPETITION: VS ${comp.rival.name.toUpperCase()}`, this.width / 2, 60);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText(`Piece: "${comp.playerPiece.title}" (${comp.playerPiece.genre})`, this.width / 2, 95);

    // Measure Progress
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(`Measure: ${comp.currentMeasure} / ${comp.totalMeasures}`, this.width / 2, 130);

    // Left Stage: Player's Ensemble
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Your Ensemble (Score: ${comp.playerScore})`, 120, 180);

    state.ensemble.members.forEach((m, idx) => {
      this.drawPixelMusician(ctx, 140 + idx * 80, 280, m, state.time);
      this.drawPixelPet(ctx, 160 + idx * 80, 320, m.pet, state.time);
    });

    // Right Stage: Rival Ensemble
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${comp.rival.name} (Score: ${comp.rivalScore})`, this.width - 120, 180);

    comp.rival.members.forEach((m, idx) => {
      this.drawPixelMusician(ctx, this.width - 200 - idx * 80, 280, m, state.time);
      this.drawPixelPet(ctx, this.width - 220 - idx * 80, 320, m.pet, state.time);
    });

    // Action Prompt
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press [SPACE] to Perform the Next Measure with Technical Precision!', this.width / 2, 540);
  }

  /* ---------------- WORLD OVERWORLD MAP ---------------- */

  private renderWorldMap(state: GameState): void {
    const ctx = this.ctx;
    const zone = WORLD_ZONES[state.currentZone];
    if (!zone) return;

    const camX = state.camera.x;
    const camY = state.camera.y;

    // Grass & Terrain Base
    ctx.fillStyle = state.currentZone === 'woodwind_woods' ? '#14532d' : (state.currentZone === 'brass_citadel' ? '#78350f' : (state.currentZone === 'percussion_peaks' ? '#3b0764' : '#064e3b'));
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Cobblestone Paths
    ctx.fillStyle = 'rgba(241, 245, 249, 0.15)';
    ctx.fillRect(0 - camX, 760 - camY, zone.width, 80);
    ctx.fillRect(960 - camX, 0 - camY, 80, zone.height);

    // Draw Obstacles
    for (const obs of zone.obstacles) {
      if (obs.type === 'box' && obs.w && obs.h) {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.fillRect(obs.x - camX, obs.y - camY, obs.w, obs.h);
        ctx.strokeRect(obs.x - camX, obs.y - camY, obs.w, obs.h);

        // Nameplate
        if (obs.name) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '12px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(obs.name, obs.x + obs.w / 2 - camX, obs.y + obs.h / 2 - camY);
        }
      } else if (obs.type === 'circle' && obs.radius) {
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(obs.x - camX, obs.y - camY, obs.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Transitions
    for (const tr of zone.transitions) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.fillRect(tr.bounds.x - camX, tr.bounds.y - camY, tr.bounds.w, tr.bounds.h);
      ctx.strokeRect(tr.bounds.x - camX, tr.bounds.y - camY, tr.bounds.w, tr.bounds.h);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tr.promptText, tr.bounds.x + tr.bounds.w / 2 - camX, tr.bounds.y + tr.bounds.h / 2 - camY);
    }

    // Draw NPCs
    for (const npc of state.npcs) {
      if (npc.zone === state.currentZone) {
        const nx = npc.x - camX;
        const ny = npc.y - camY;

        if (npc.musicianData) {
          this.drawPixelMusician(ctx, nx, ny, npc.musicianData, state.time);
          this.drawPixelPet(ctx, nx + 24, ny + 4, npc.musicianData.pet, state.time);
        } else {
          // Prop NPC (Practice Shed or Music Stand)
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(nx, ny, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, nx, ny - 24);
      }
    }

    // Draw Player and Active Harmonipet Familiar (No conga train)
    const px = state.player.x - camX;
    const py = state.player.y - camY;

    if (state.ensemble.members.length > 0) {
      const player = state.ensemble.members[0];
      this.drawPixelMusician(ctx, px, py, player, state.time, state.customization);
      this.drawPixelPet(ctx, px + 24, py + 4, player.pet, state.time, state.customization?.petTint);
    }

    // Proximity Prompt Banner
    if (state.nearbyInteractable) {
      const target = state.nearbyInteractable;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(this.width / 2 - 200, this.height - 100, 400, 44, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(target.title, this.width / 2, this.height - 72);
    }
  }

  /* ---------------- HUD OVERLAY ---------------- */

  private renderHUD(state: GameState): void {
    const ctx = this.ctx;
    const zone = WORLD_ZONES[state.currentZone];

    // Top Bar Container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, this.width, 54);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 54);
    ctx.lineTo(this.width, 54);
    ctx.stroke();

    // Zone Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`📍 ${zone ? zone.name : 'Sonora'}`, 24, 34);

    // Ensemble Tier Badge
    const tierName = state.ensemble.tier.toUpperCase();
    const count = state.ensemble.members.length;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎼 [${tierName} - ${count} Musician${count > 1 ? 's' : ''}]`, this.width / 2, 34);

    // Currency Wallet & Reputation
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.textAlign = 'right';
    let stars = '';
    for (let i = 0; i < state.wallet.reputationStars; i++) stars += '★';
    if (stars === '') stars = '☆☆☆☆☆';
    ctx.fillText(`♪ ${state.wallet.gold}  |  ✨ ${state.wallet.inspirationSparks}  |  ★ ${stars}`, this.width - 24, 34);

    // Bottom-Left Movement Helper
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(16, this.height - 48, 310, 32, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🎮 Move: [W A S D] or [↑ ← ↓ →]', 28, this.height - 27);
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

  /* ---------------- PIXEL ART HELPERS ---------------- */

  private drawPixelMusician(ctx: CanvasRenderingContext2D, x: number, y: number, m: Musician, t: number, custom?: PlayerCustomization): void {
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
    ctx.fillRect(x - 6, y + 14 + bob, 4, 10);
    ctx.fillRect(x + 2, y + 14 - bob, 4, 10);

    // Torso / Tunic
    ctx.fillStyle = outfit;
    ctx.beginPath();
    ctx.roundRect(x - 10, y + bob, 20, 16, 4);
    ctx.fill();

    // Collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - 5, y + bob, 10, 4, 2);
    ctx.fill();

    // Head / Face
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x, y - 10 + bob, 10, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 4, y - 11 + bob, 2, 3);
    ctx.fillRect(x + 2, y - 11 + bob, 2, 3);

    // Hair
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.arc(x, y - 13 + bob, 11, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - 10, y - 12 + bob, 3, 7);
    ctx.fillRect(x + 7, y - 12 + bob, 3, 7);

    // Hat / Accessory
    if (hat === 'beret') {
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.ellipse(x + 2, y - 17 + bob, 13, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(x + 4, y - 22 + bob, 2, 4);
    } else if (hat === 'feather_cap') {
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.ellipse(x, y - 17 + bob, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(x + 6, y - 17 + bob);
      ctx.lineTo(x + 12, y - 28 + bob);
      ctx.lineTo(x + 4, y - 22 + bob);
      ctx.fill();
    } else if (hat === 'maestro') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 11, y - 18 + bob, 22, 4);
      ctx.fillRect(x - 8, y - 30 + bob, 16, 12);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 8, y - 20 + bob, 16, 2);
    } else if (hat === 'headband') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - 10, y - 14 + bob, 20, 3);
    }

    // Handheld Instrument
    const finish = m.isPlayer && custom ? custom.instrumentFinish : 'classic_amber';
    let instColor = '#d97706';
    if (finish === 'gilded_gold') instColor = '#fbbf24';
    if (finish === 'midnight_obsidian') instColor = '#1e1b4b';
    if (finish === 'rosewood') instColor = '#881337';

    if (m.section === 'strings') {
      ctx.fillStyle = instColor;
      ctx.beginPath();
      ctx.ellipse(x + 11, y + 4 + bob, 6, 9, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 14, y - 4 + bob);
      ctx.lineTo(x + 7, y + 14 + bob);
      ctx.stroke();
    } else if (m.section === 'woodwinds') {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + 8, y - 2 + bob, 16, 3);
    } else if (m.section === 'brass') {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 8, y + 2 + bob, 10, 4);
      ctx.beginPath();
      ctx.moveTo(x + 18, y + bob);
      ctx.lineTo(x + 24, y - 3 + bob);
      ctx.lineTo(x + 24, y + 7 + bob);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x + 8, y + 2 + bob, 8, 2);
      ctx.fillRect(x + 6, y + 8 + bob, 8, 2);
    }
  }

  private drawPixelPet(ctx: CanvasRenderingContext2D, x: number, y: number, pet: Harmonipet, t: number, tint?: string): void {
    const hop = Math.abs(Math.sin(t * 6)) * 4;
    const bodyColor = tint || pet.color;

    // Soft Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const spriteType = pet.sprite ? pet.sprite.toLowerCase() : '';

    if (spriteType.includes('swan')) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(x, y - hop + 2, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 4, y - hop + 2);
      ctx.quadraticCurveTo(x + 10, y - hop - 6, x + 6, y - hop - 10);
      ctx.stroke();
      ctx.fillStyle = '#f97316';
      ctx.fillRect(x + 8, y - hop - 10, 4, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 5, y - hop - 11, 2, 2);
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.ellipse(x - 2, y - hop + 1, 6, 4, Math.sin(t * 8) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (spriteType.includes('finch')) {
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(x, y - hop, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x + 2, y - hop + 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(x + 6, y - hop - 1);
      ctx.lineTo(x + 11, y - hop);
      ctx.lineTo(x + 6, y - hop + 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 3, y - hop - 3, 2, 2);
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x - 10, y - hop - 2, 5, 3);
    } else if (spriteType.includes('terrier') || spriteType.includes('hound')) {
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.roundRect(x - 8, y - hop - 2, 14, 9, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 6, y - hop - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(x + 4, y - hop - 2 + Math.sin(t * 8) * 2, 3, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 10, y - hop - 4, 2, 2);
      ctx.fillRect(x + 6, y - hop - 6, 2, 2);
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 8, y - hop);
      ctx.lineTo(x - 13, y - hop - 6 + Math.sin(t * 12) * 4);
      ctx.stroke();
    } else if (spriteType.includes('raccoon')) {
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(x, y - hop, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 5, y - hop - 2, 11, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 3, y - hop - 1, 2, 2);
      ctx.fillRect(x + 2, y - hop - 1, 2, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 6, y - hop - 9, 3, 4);
      ctx.fillRect(x + 3, y - hop - 9, 3, 4);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(x - 10, y - hop + 2, 6, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(x, y - hop, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 4, y - hop - 2, 2, 3);
      ctx.fillRect(x + 2, y - hop - 2, 2, 3);
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x - 6, y - hop - 10, 3, 4);
      ctx.fillRect(x + 3, y - hop - 10, 3, 4);
    }

    if (Math.sin(t * 3) > 0.5) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('♪', x + 8, y - hop - 10);
    }
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
    const barY = 360;
    this.drawBar(ctx, barX, barY, barW, barH, enc.resonanceMeter, 100, '#10b981', `Resonance: ${enc.resonanceMeter}% (Threshold: ${enc.catchThreshold}%)`);

    // Threshold Marker
    const threshX = barX + (enc.catchThreshold / 100) * barW;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(threshX, barY - 4);
    ctx.lineTo(threshX, barY + barH + 4);
    ctx.stroke();

    // Attempts Counter
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Harmonic Attempts Remaining: ${enc.attemptsRemaining} / 4`, this.width / 2, 425);

    // Note Action Buttons
    const notes = [
      { label: '[1] C4 (Root)', freq: 261.63, sub: 'Foundation' },
      { label: '[2] E4 (Third)', freq: 329.63, sub: 'Harmonic Warmth' },
      { label: '[3] G4 (Fifth)', freq: 392.00, sub: 'Consonance' },
      { label: '[4] C5 (Octave)', freq: 523.25, sub: 'Overtone Surge' }
    ];

    const cardW = 190;
    const cardH = 80;
    const gap = 16;
    const startX = (this.width - (cardW * 4 + gap * 3)) / 2;
    const cardY = 480;

    notes.forEach((n, idx) => {
      const cx = startX + idx * (cardW + gap);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, cx + cardW / 2, cardY + 34);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(n.sub, cx + cardW / 2, cardY + 58);
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
    ctx.roundRect(140, 40, this.width - 280, 180, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(q.prompt, this.width / 2, 85);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText(q.subtext, this.width / 2, 130);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillText(`Question ${ch.currentQuestionIndex + 1} of ${ch.questions.length} | Current Score: ${ch.score} pts`, this.width / 2, 175);

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
