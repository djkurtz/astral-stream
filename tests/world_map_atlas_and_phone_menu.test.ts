import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { HarmoniaUI } from '../src/ui';
import { ZoneId } from '../src/types';

describe('Harmonia Overworld Atlas & Phone Menu Navigation QA Suite', () => {
  let engine: HarmoniaGameEngine;
  let ui: HarmoniaUI;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container">
        <canvas id="game-canvas" width="1280" height="720"></canvas>
        <div class="floating-toolbar">
          <button id="btn-phone" class="tool-btn" data-tooltip="HarmoniPhone [TAB / P]">📱</button>
          <button id="btn-quickwheel" class="tool-btn" data-tooltip="Quick-Wheel [Q]">🎡</button>
          <button id="btn-system" class="tool-btn" data-tooltip="System Menu & Settings [ESC]">⚙️</button>
        </div>
        <div id="modal-map" class="modal-overlay hidden">
          <div id="map-body"></div>
        </div>
        <div id="modal-badges" class="modal-overlay hidden">
          <div id="badges-list"></div>
        </div>
        <div id="modal-dispatch" class="modal-overlay hidden">
          <div id="dispatch-body"></div>
        </div>
        <div id="modal-system" class="modal-overlay hidden">
          <div id="system-body"></div>
        </div>
      </div>
    `;

    engine = new HarmoniaGameEngine();
    ui = new HarmoniaUI(engine);
  });

  // =========================================================================
  // 1. OVERWORLD ATLAS MODAL (SVG NODES, HOVER TOOLTIPS & NO BOTTOM PILLS)
  // =========================================================================
  describe('1. Overworld Atlas Modal & SVG Map', () => {
    it('should render SVG map with 9 circular nodes and no bottom pill buttons', () => {
      ui.renderWorldMapModal();
      const mapBody = document.getElementById('map-body')!;
      expect(mapBody).toBeTruthy();

      // Ensure bottom pills container is NOT present
      const pillsContainer = mapBody.querySelector('.atlas-node-pills');
      expect(pillsContainer).toBeNull();

      // Check that all 9 regions exist as SVG nodes
      const expectedNodes: ZoneId[] = [
        'brass_citadel',
        'north_wilderness',
        'woodwind_woods',
        'east_wilderness',
        'percussion_peaks',
        'south_wilderness',
        'cavatina_village',
        'west_wilderness',
        'grand_hall'
      ];

      expectedNodes.forEach(zoneId => {
        const nodeEl = mapBody.querySelector(`#node-${zoneId}`);
        expect(nodeEl).toBeTruthy();
      });
    });

    it('should include native SVG <title> tooltip in every region node', () => {
      ui.renderWorldMapModal();
      const mapBody = document.getElementById('map-body')!;

      const nodeBrass = mapBody.querySelector('#node-brass_citadel')!;
      const titleBrass = nodeBrass.querySelector('title');
      expect(titleBrass).toBeTruthy();
      expect(titleBrass?.textContent).toBe('The Brass Citadel');

      const nodeCentral = mapBody.querySelector('#node-grand_hall')!;
      const titleCentral = nodeCentral.querySelector('title');
      expect(titleCentral).toBeTruthy();
      expect(titleCentral?.textContent).toBe('The Central City');

      const nodeCavatina = mapBody.querySelector('#node-cavatina_village')!;
      expect(nodeCavatina.querySelector('title')?.textContent).toBe('Cavatina Village');
    });

    it('should NOT render static text words or route labels on the SVG map', () => {
      ui.renderWorldMapModal();
      const mapBody = document.getElementById('map-body')!;
      const svgText = mapBody.querySelector('svg')?.innerHTML || '';

      // Route pass texts must be removed
      expect(svgText).not.toContain('NW Pass: Lyre ↔ Echo');
      expect(svgText).not.toContain('SW Pass: Lyre ↔ Rumble');
      expect(svgText).not.toContain('NE Pass: Echo ↔ Breeze');
      expect(svgText).not.toContain('SE Pass: Breeze ↔ Rumble');

      // The nodes should only have emoji icons in text tags, no full names in text elements
      const allTextElements = mapBody.querySelectorAll('svg text');
      allTextElements.forEach(textEl => {
        const content = textEl.textContent?.trim() || '';
        // Content should only be single emojis (length 1 or 2 due to surrogate pairs)
        expect(['🎺', '🪈', '🥁', '🎻', '🏛️', '🏜️', '🍃', '🌋', '🌲']).toContain(content);
      });
    });

    it('should dynamically update the spacious inspector panel on node mouseenter and click', () => {
      ui.renderWorldMapModal();
      const mapBody = document.getElementById('map-body')!;
      const inspector = mapBody.querySelector('#atlas-inspector-content')!;
      expect(inspector).toBeTruthy();

      // Initial state displays currentZone (default cavatina_village)
      expect(inspector.textContent).toContain('Cavatina Village');
      expect(inspector.textContent).toContain('Strings Section');

      // Simulate mouseenter on Woodwind Woods
      const nodeWoodwind = mapBody.querySelector('#node-woodwind_woods')!;
      nodeWoodwind.dispatchEvent(new MouseEvent('mouseenter'));

      expect(inspector.textContent).toContain('Woodwind Woods');
      expect(inspector.textContent).toContain('Woodwinds Section');
      expect(inspector.textContent).toContain('Bandleader Sylvan');

      // Simulate click on Brass Citadel
      const nodeBrass = mapBody.querySelector('#node-brass_citadel')!;
      nodeBrass.dispatchEvent(new MouseEvent('click'));

      expect(inspector.textContent).toContain('The Brass Citadel');
      expect(inspector.textContent).toContain('Brass Section');
      expect(inspector.textContent).toContain('Baroness Vesta');
    });

    it('should support fast travel button when inspecting a discovered remote region', () => {
      const state = engine.getState();
      state.discoveredZones['brass_citadel'] = true;
      state.currentZone = 'cavatina_village';

      ui.renderWorldMapModal();
      const mapBody = document.getElementById('map-body')!;

      // Click on discovered region
      const nodeBrass = mapBody.querySelector('#node-brass_citadel')!;
      nodeBrass.dispatchEvent(new MouseEvent('click'));

      const travelBtn = mapBody.querySelector('#btn-fast-travel') as HTMLButtonElement;
      expect(travelBtn).toBeTruthy();

      const warpSpy = vi.spyOn(engine, 'warpToZone');
      travelBtn.click();
      expect(warpSpy).toHaveBeenCalledWith('brass_citadel', expect.any(Object));
    });
  });

  // =========================================================================
  // 2. FLOATING ACTION TOOLBAR & PHONE MENU INTEGRATION
  // =========================================================================
  describe('2. Floating Action Toolbar & Phone Menu Integration', () => {
    it('should wire btn-phone and btn-quickwheel properly', () => {
      const togglePhoneSpy = vi.spyOn(engine, 'togglePhone');
      const toggleQuickWheelSpy = vi.spyOn(engine, 'toggleQuickWheel');

      const btnPhone = document.getElementById('btn-phone')!;
      const btnQuickwheel = document.getElementById('btn-quickwheel')!;

      btnPhone.click();
      expect(togglePhoneSpy).toHaveBeenCalled();

      btnQuickwheel.click();
      expect(toggleQuickWheelSpy).toHaveBeenCalled();
    });

    it('should allow setActiveQuest to update active quest id', () => {
      expect(engine.getState().activeQuestId).toBe('quest_ch1');
      engine.setActiveQuest('quest_ch2');
      expect(engine.getState().activeQuestId).toBe('quest_ch2');
    });

    it('should open Badges and Dispatch modals via custom events', () => {
      const modalBadges = document.getElementById('modal-badges')!;
      const modalDispatch = document.getElementById('modal-dispatch')!;

      expect(modalBadges.classList.contains('hidden')).toBe(true);
      window.dispatchEvent(new CustomEvent('open-badges-modal'));
      expect(modalBadges.classList.contains('hidden')).toBe(false);

      expect(modalDispatch.classList.contains('hidden')).toBe(true);
      window.dispatchEvent(new CustomEvent('open-dispatch-modal'));
      expect(modalDispatch.classList.contains('hidden')).toBe(false);
    });
  });
});
