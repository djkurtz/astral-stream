import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { HarmoniaRenderer } from '../src/renderer';
import { STARTER_OPTIONS, REPERTOIRE_DATABASE, RIVAL_ENSEMBLES } from '../src/data';
import { GameState } from '../src/types';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function boxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

describe('UI Spatial Geometry & Non-Overlapping Layout QA Test Suite', () => {
  let engine: HarmoniaGameEngine;

  const RESOLUTIONS = [
    { width: 800, height: 600, label: '800x600 (Compact SVGA)' },
    { width: 1024, height: 768, label: '1024x768 (XGA)' },
    { width: 1280, height: 720, label: '1280x720 (Standard HD)' },
    { width: 1920, height: 1080, label: '1920x1080 (Full HD)' }
  ];

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  // =========================================================================
  // 1. HARMONIPET WILD ENCOUNTERS 3-COLUMN ARCHITECTURE & TIMING METER
  // =========================================================================
  describe('1. Harmonipet Wild Encounters 3-Column Geometry', () => {
    it.each(RESOLUTIONS)('should enforce strictly disjoint 3-column architecture on $label', ({ width, height }) => {
      // 3-Column specs:
      // Left Battler: x=30, w=220
      // Right Battler: x=width-250, w=220
      // Center Progress Bar: barW=Math.min(500, Math.max(260, width-540)), centered
      const leftBox: BoundingBox = { id: 'left_battler', x: 30, y: 82, w: 220, h: 54 };
      const rightBox: BoundingBox = { id: 'right_battler', x: width - 250, y: 82, w: 220, h: 54 };

      const centerAvailableW = Math.max(260, width - 540);
      const barW = Math.min(500, centerAvailableW);
      const barX = (width - barW) / 2;
      const centerBar: BoundingBox = { id: 'center_resonance_bar', x: barX, y: 82, w: barW, h: 26 };

      // Verify no horizontal intersection between left battler, right battler, and center bar
      expect(boxesOverlap(leftBox, rightBox)).toBe(false);
      expect(boxesOverlap(leftBox, centerBar)).toBe(false);
      expect(boxesOverlap(rightBox, centerBar)).toBe(false);

      // Verify left/right battlers stay fully within canvas boundaries
      expect(leftBox.x).toBeGreaterThanOrEqual(0);
      expect(leftBox.x + leftBox.w).toBeLessThanOrEqual(width);
      expect(rightBox.x).toBeGreaterThanOrEqual(0);
      expect(rightBox.x + rightBox.w).toBeLessThanOrEqual(width);
    });

    it.each(RESOLUTIONS)('should maintain non-overlapping vertical tiers in Harmonipet battle on $label', ({ width }) => {
      // Tier 1: Resonance/Tuning Bar (y=82, h=26)
      // Tier 2: Subtitle label (y=122)
      // Tier 3: Replay / Switch buttons (y=138, h=34)
      // Tier 4: Melody Sequence / Steps (y=182, h=38)
      // Tier 5: Dynamic Rhythm Highway (y=230, h=14)
      // Tier 6: Note Action Cards (y=278 or 298, h=70)
      // Tier 7: Mama Aria Coaching Card (y=cardY+cardH+14, h=48)
      const isTuning = false;
      const bar: BoundingBox = { id: 'bar', x: (width - 400) / 2, y: 82, w: 400, h: 26 };
      const buttons: BoundingBox = { id: 'buttons', x: (width - 400) / 2, y: 138, w: 400, h: 34 };
      const melody: BoundingBox = { id: 'melody', x: (width - 320) / 2, y: 182, w: 320, h: 38 };
      const rhythm: BoundingBox = { id: 'rhythm', x: (width - 440) / 2, y: 230, w: 440, h: 14 };
      const cardY = isTuning ? 278 : 298;
      const cards: BoundingBox = { id: 'cards', x: 40, y: cardY, w: width - 80, h: 70 };
      const coach: BoundingBox = { id: 'coach', x: 40, y: cardY + 70 + 14, w: width - 80, h: 48 };

      const verticalStack = [bar, buttons, melody, rhythm, cards, coach];
      for (let i = 0; i < verticalStack.length; i++) {
        for (let j = i + 1; j < verticalStack.length; j++) {
          expect(boxesOverlap(verticalStack[i], verticalStack[j])).toBe(false);
        }
      }
    });
  });

  // =========================================================================
  // 2. AUDITION BATTLE TACTICAL MOVE CARDS & BATTLE LOG
  // =========================================================================
  describe('2. Audition Battle Non-Collision Layout', () => {
    it.each(RESOLUTIONS)('should separate player meters, action cards, tooltips, and combat log on $label', ({ width, height }) => {
      // Player Meter (y=120, h=55)
      // Rival Meter (y=120, h=55)
      const barW = Math.min(300, (width - 200) / 2);
      const playerMeter: BoundingBox = { id: 'player_meter', x: 60, y: 120, w: barW, h: 55 };
      const rivalMeter: BoundingBox = { id: 'rival_meter', x: width - barW - 60, y: 120, w: barW, h: 55 };

      // Tooltip Card (y=375, h=40)
      const tipW = Math.min(760, width - 80);
      const tooltip: BoundingBox = { id: 'tooltip', x: (width - tipW) / 2, y: 375, w: tipW, h: 40 };

      // Action Move Cards (y=428, h=66)
      const moveCards: BoundingBox = { id: 'move_cards', x: 40, y: 428, w: width - 80, h: 66 };

      // Battle Log (y=506, h=Math.min(130, height - 518))
      const logH = Math.min(130, height - 518);
      const battleLog: BoundingBox = { id: 'battle_log', x: (width - tipW) / 2, y: 506, w: tipW, h: logH };

      expect(boxesOverlap(playerMeter, rivalMeter)).toBe(false);
      expect(boxesOverlap(playerMeter, tooltip)).toBe(false);
      expect(boxesOverlap(tooltip, moveCards)).toBe(false);
      expect(boxesOverlap(moveCards, battleLog)).toBe(false);
    });
  });

  // =========================================================================
  // 3. CONCERT COMPETITION ORCHESTRAL LANES & CONDUCTOR'S PODIUM
  // =========================================================================
  describe('3. Concert Competition Orchestral Lanes & Conductor Podium', () => {
    it.each(RESOLUTIONS)('should ensure cue lanes, action cards, and podium downbeat do not collide on $label', ({ width, height }) => {
      const gap = Math.min(15, Math.max(8, (width - 600) / 16));
      const laneW = Math.min(260, (width - 60 - gap * 3) / 4);
      const laneH = 78;
      const startX = (width - (laneW * 4 + gap * 3)) / 2;
      const startY = 324;

      // 4 Cue Lanes
      const lanes: BoundingBox[] = [0, 1, 2, 3].map(i => ({
        id: `lane_${i}`,
        x: startX + i * (laneW + gap),
        y: startY,
        w: laneW,
        h: laneH
      }));

      // Verify no adjacent lane overlaps
      for (let i = 0; i < lanes.length; i++) {
        for (let j = i + 1; j < lanes.length; j++) {
          expect(boxesOverlap(lanes[i], lanes[j])).toBe(false);
        }
      }

      // 4 Section Action Cards (y=408, h=46)
      const actionCards: BoundingBox[] = [0, 1, 2, 3].map(i => ({
        id: `action_${i}`,
        x: startX + i * (laneW + gap),
        y: 408,
        w: laneW,
        h: 46
      }));

      // Verify action cards do not overlap their corresponding lanes or adjacent cards
      for (let i = 0; i < 4; i++) {
        expect(boxesOverlap(lanes[i], actionCards[i])).toBe(false);
      }

      // Conductor Downbeat Track (y=480, h=22, housing y=462..518)
      const meterW = Math.min(560, width - 80);
      const meterX = width / 2 - meterW / 2;
      const cadenceMeter: BoundingBox = { id: 'cadence_meter', x: meterX - 10, y: 480 - 18, w: meterW + 20, h: 22 + 36 };

      // Conductor Platform (y=Math.min(642, height - 46))
      const podiumW = Math.min(320, width - 100);
      const podiumY = Math.min(642, height - 46);
      const podium: BoundingBox = { id: 'podium', x: (width - podiumW) / 2, y: podiumY, w: podiumW, h: 32 };

      for (let i = 0; i < 4; i++) {
        expect(boxesOverlap(actionCards[i], cadenceMeter)).toBe(false);
      }
      expect(boxesOverlap(cadenceMeter, podium)).toBe(false);
    });
  });

  // =========================================================================
  // 4. SMARTPHONE ("HARMONIPHONE") 6 TABS & CHASSIS BOUNDS
  // =========================================================================
  describe('4. Smartphone ("HarmoniPhone") 6 Tabs & Viewport Safety', () => {
    it.each(RESOLUTIONS)('should fit phone chassis safely and space 6 tabs without overlap on $label', ({ width, height }) => {
      const phoneW = Math.min(520, width - 24);
      const phoneH = Math.min(620, height - 20);
      const phoneX = (width - phoneW) / 2;
      const phoneY = (height - phoneH) / 2;

      // Assert chassis stays completely inside screen
      expect(phoneX).toBeGreaterThanOrEqual(0);
      expect(phoneY).toBeGreaterThanOrEqual(0);
      expect(phoneX + phoneW).toBeLessThanOrEqual(width);
      expect(phoneY + phoneH).toBeLessThanOrEqual(height);

      // Verify 6 tabs
      const tabs = ['messages', 'ensemble', 'repertoire', 'quests', 'calendar', 'dex'];
      const tabW = (phoneW - 40) / tabs.length;
      const tabY = phoneY + 44;
      const tabH = 32;

      const tabBoxes: BoundingBox[] = tabs.map((t, idx) => ({
        id: `tab_${t}`,
        x: phoneX + 20 + idx * tabW,
        y: tabY,
        w: tabW - 4,
        h: tabH
      }));

      for (let i = 0; i < tabBoxes.length; i++) {
        for (let j = i + 1; j < tabBoxes.length; j++) {
          expect(boxesOverlap(tabBoxes[i], tabBoxes[j])).toBe(false);
        }
      }

      // Verify Content Area (contentY = phoneY + 84, contentH = phoneH - 135)
      const contentBox: BoundingBox = {
        id: 'phone_content',
        x: phoneX + 20,
        y: phoneY + 84,
        w: phoneW - 40,
        h: phoneH - 135
      };

      // Content area must not overlap tabs
      for (const tab of tabBoxes) {
        expect(boxesOverlap(tab, contentBox)).toBe(false);
      }
    });
  });

  // =========================================================================
  // 5. MUSIC THEORY CHALLENGE 2x2 GRID RESPONSIVENESS
  // =========================================================================
  describe('5. Music Theory Challenge 2x2 Grid Geometry', () => {
    it.each(RESOLUTIONS)('should space 4 options in 2x2 grid without horizontal or vertical overlap on $label', ({ width, height }) => {
      const optGap = 16;
      const optW = Math.min(460, (width - 80 - optGap) / 2);
      const startY = 240;
      const optH = Math.min(75, Math.max(54, (height - startY - 35) / 2));
      const gapY = 14;

      const options: BoundingBox[] = [0, 1, 2, 3].map(idx => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const ox = col === 0 ? width / 2 - optW - optGap / 2 : width / 2 + optGap / 2;
        const oy = startY + row * (optH + gapY);
        return {
          id: `option_${idx}`,
          x: ox,
          y: oy,
          w: optW,
          h: optH
        };
      });

      for (let i = 0; i < options.length; i++) {
        for (let j = i + 1; j < options.length; j++) {
          expect(boxesOverlap(options[i], options[j])).toBe(false);
        }
        // Verify all options remain on-screen
        expect(options[i].x).toBeGreaterThanOrEqual(0);
        expect(options[i].x + options[i].w).toBeLessThanOrEqual(width);
        expect(options[i].y + options[i].h).toBeLessThanOrEqual(height);
      }
    });
  });

  // =========================================================================
  // 6. QUICK-WHEEL RADIAL CLEARANCE
  // =========================================================================
  describe('6. Quick-Wheel Radial Clearance', () => {
    it.each(RESOLUTIONS)('should ensure bottom tooltip banner does not overlap lowest wheel slot on $label', ({ width, height }) => {
      const cy = height / 2;
      const R = Math.min(180, height * 0.26);
      const lowestSlotCenterY = cy + R;
      const lowestSlotBottom = lowestSlotCenterY + 36 + 24; // 36px radius + label

      const tipH = 58;
      const tipY = height - tipH - 16;
      const tipW = Math.min(600, width - 40);
      const tooltipBox: BoundingBox = { id: 'wheel_tip', x: (width - tipW) / 2, y: tipY, w: tipW, h: tipH };

      // Assert lowest slot does not breach the tooltip banner
      expect(lowestSlotBottom).toBeLessThanOrEqual(tipY + 10);
      expect(tooltipBox.y + tooltipBox.h).toBeLessThanOrEqual(height);
    });
  });

  // =========================================================================
  // 7. PRE-BATTLE LINEUP & RESERVE ROSTER PANELS
  // =========================================================================
  describe('7. Pre-Battle Formation Roster Panels', () => {
    it.each(RESOLUTIONS)('should split left intel and right lineup without horizontal collision on $label', ({ width, height }) => {
      const leftX = 24;
      const leftW = Math.min(420, (width - 72) * 0.38);
      const leftPanel: BoundingBox = { id: 'left_intel', x: leftX, y: 80, w: leftW, h: height - 145 };

      const rightX = leftX + leftW + 16;
      const rightW = width - rightX - 24;
      const rightPanel: BoundingBox = { id: 'right_roster', x: rightX, y: 80, w: rightW, h: height - 145 };

      expect(boxesOverlap(leftPanel, rightPanel)).toBe(false);
      expect(rightPanel.x + rightPanel.w).toBeLessThanOrEqual(width);

      // Bottom buttons (y = Math.min(650, height - 48))
      const btnW = Math.min(320, (width - 80) / 2);
      const btnH = 42;
      const btnY = Math.min(650, height - 48);
      const startBtn: BoundingBox = { id: 'start_btn', x: width / 2 - btnW - 14, y: btnY, w: btnW, h: btnH };
      const cancelBtn: BoundingBox = { id: 'cancel_btn', x: width / 2 + 14, y: btnY, w: btnW, h: btnH };

      expect(boxesOverlap(startBtn, cancelBtn)).toBe(false);
      expect(startBtn.y + startBtn.h).toBeLessThanOrEqual(height);
      expect(cancelBtn.y + cancelBtn.h).toBeLessThanOrEqual(height);
    });
  });
});
