import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { HarmoniaUI } from '../src/ui';
import { REPERTOIRE_DATABASE, RECRUITABLE_MUSICIANS } from '../src/data';
import { Musician } from '../src/types';

describe('Harmonia Disk-Based Save File Export & Import Test Suite', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro Virtuoso');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  // =========================================================================
  // 1. JSON SCHEMA GENERATION & METADATA VALIDATION
  // =========================================================================
  describe('1. JSON Schema Generation & Export Structure', () => {
    it('should generate a valid, indented JSON string with required metadata headers', () => {
      const exportedJson = engine.exportSaveFile();
      expect(typeof exportedJson).toBe('string');
      expect(exportedJson.length).toBeGreaterThan(100);

      // Verify it is formatted / multi-line
      expect(exportedJson).toContain('\n');
      expect(exportedJson).toContain('  "version":');

      const parsed = JSON.parse(exportedJson);
      expect(parsed).toBeDefined();
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.game).toBe('Harmonia: Opus of the Ensemble');
      expect(parsed.schema).toBe('harmonia_save_v1');
      expect(parsed.exportedAt).toBeDefined();
      expect(new Date(parsed.exportedAt).getTime()).not.toBeNaN();
    });

    it('should include comprehensive state payload in data field', () => {
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      const data = parsed.data;

      expect(data).toBeDefined();
      expect(data.currentZone).toBe('cavatina_village');
      expect(data.player).toBeDefined();
      expect(data.player.x).toBe(1000);
      expect(data.player.y).toBe(920);
      expect(data.player.dir).toBe('down');

      expect(data.wallet).toBeDefined();
      expect(data.wallet.gold).toBe(150);
      expect(data.wallet.inspirationSparks).toBe(10);
      expect(data.wallet.reputationStars).toBe(0);

      expect(data.ensemble).toBeDefined();
      expect(data.ensemble.members.length).toBe(1);
      expect(data.ensemble.members[0].name).toBe('Maestro Virtuoso');

      expect(Array.isArray(data.harmoniDex)).toBe(true);
      expect(data.harmoniDex.length).toBeGreaterThanOrEqual(16);

      expect(Array.isArray(data.badges)).toBe(true);
      expect(data.badges.length).toBe(8);

      expect(Array.isArray(data.quests)).toBe(true);
      expect(Array.isArray(data.repertoire)).toBe(true);
      expect(data.proficiency).toBeDefined();
      expect(data.hasPianoAccompaniment).toBe(false);
    });
  });

  // =========================================================================
  // 2. ROUND-TRIP SERIALIZATION & STATE PRESERVATION
  // =========================================================================
  describe('2. Round-Trip Serialization & State Preservation', () => {
    it('should preserve mutated player stats, wallet, unlocks, and party across export/import', () => {
      const state = engine.getState();

      // Mutate state: advance wallet
      state.wallet.gold = 7500;
      state.wallet.inspirationSparks = 420;
      state.wallet.reputationStars = 25;

      // Move player position
      state.currentZone = 'woodwind_woods';
      state.player.x = 450;
      state.player.y = 800;
      state.player.dir = 'up';

      // Unlock additional instrument and increase proficiency
      state.proficiency.unlockedInstruments.push('silver_flute', 'french_horn');
      state.proficiency.instruments['silver_flute'].level = 5;
      state.proficiency.instruments['silver_flute'].xp = 1200;
      state.proficiency.sections.woodwinds = 60;

      // Recruit an additional musician to ensemble
      const claraMusician: Musician = JSON.parse(JSON.stringify(RECRUITABLE_MUSICIANS[0]));
      state.ensemble.members.push(claraMusician);
      state.ensemble.tier = 'duet';
      state.recruitedMusicians.push(claraMusician);

      // Award clef badges and complete quests
      state.badges[0].obtained = true;
      state.badges[1].obtained = true;
      state.quests[0].completed = true;
      state.activeQuestId = 'quest_ch2';
      state.questInventory.push('brass_music_box_pins');
      state.openedChests.push('chest_cavatina_secret');
      state.discoveredSecrets = ['mozart_secret_1'];

      // Add sheet music
      const secondPiece = REPERTOIRE_DATABASE[1];
      if (secondPiece && !state.repertoire.some(p => p.id === secondPiece.id)) {
        state.repertoire.push(secondPiece);
      }

      // Pianist accompanist victory
      state.pianistBuskingWins = 3;
      state.hasPianoAccompaniment = true;

      // EXPORT STATE
      const exportedJson = engine.exportSaveFile();

      // CREATE A NEW ENGINE INSTANCE (Default blank state)
      const freshEngine = new HarmoniaGameEngine();
      expect(freshEngine.getState().wallet.gold).toBe(150);
      expect(freshEngine.getState().ensemble.members.length).toBe(0);

      // IMPORT TO FRESH ENGINE
      const importResult = freshEngine.importSaveFile(exportedJson);
      expect(importResult.success).toBe(true);
      expect(importResult.error).toBeUndefined();

      // VERIFY ALL PROPERTIES RESTORED
      const restoredState = freshEngine.getState();
      expect(restoredState.mode).toBe('exploration');
      expect(restoredState.currentZone).toBe('woodwind_woods');
      expect(restoredState.player.x).toBe(450);
      expect(restoredState.player.y).toBe(800);
      expect(restoredState.player.dir).toBe('up');

      expect(restoredState.wallet.gold).toBe(7500);
      expect(restoredState.wallet.inspirationSparks).toBe(420);
      expect(restoredState.wallet.reputationStars).toBe(25);

      expect(restoredState.proficiency.unlockedInstruments).toContain('silver_flute');
      expect(restoredState.proficiency.unlockedInstruments).toContain('french_horn');
      expect(restoredState.proficiency.instruments['silver_flute'].level).toBe(5);
      expect(restoredState.proficiency.sections.woodwinds).toBe(60);

      expect(restoredState.ensemble.members.length).toBe(2);
      expect(restoredState.ensemble.tier).toBe('duet');
      expect(restoredState.ensemble.members[0].name).toBe('Maestro Virtuoso');
      expect(restoredState.ensemble.members[1].name).toBe(claraMusician.name);
      expect(restoredState.recruitedMusicians.length).toBe(2);

      expect(restoredState.badges[0].obtained).toBe(true);
      expect(restoredState.badges[1].obtained).toBe(true);
      expect(restoredState.badges[2].obtained).toBe(false);

      expect(restoredState.quests[0].completed).toBe(true);
      expect(restoredState.activeQuestId).toBe('quest_ch2');
      expect(restoredState.questInventory).toContain('brass_music_box_pins');
      expect(restoredState.openedChests).toContain('chest_cavatina_secret');
      expect(restoredState.discoveredSecrets).toContain('mozart_secret_1');

      expect(restoredState.pianistBuskingWins).toBe(3);
      expect(restoredState.hasPianoAccompaniment).toBe(true);

      // Verify localStorage was updated with the restored save
      expect(localStorage.getItem('harmonia_saved_game')).not.toBeNull();
    });

    it('should support importing legacy/unwrapped payload objects directly without top-level wrapper', () => {
      const state = engine.getState();
      state.wallet.gold = 3333;
      
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      // Pass only the inner data payload as string
      const rawPayloadJson = JSON.stringify(parsed.data);

      const freshEngine = new HarmoniaGameEngine();
      const importResult = freshEngine.importSaveFile(rawPayloadJson);
      expect(importResult.success).toBe(true);
      expect(freshEngine.getState().wallet.gold).toBe(3333);
    });
  });

  // =========================================================================
  // 3. SCHEMA VALIDATION & CORRUPTION HANDLING
  // =========================================================================
  describe('3. Schema Validation & Corruption Handling', () => {
    it('should reject empty or whitespace strings', () => {
      expect(engine.importSaveFile('').success).toBe(false);
      expect(engine.importSaveFile('   ').success).toBe(false);
      expect(engine.importSaveFile(null as any).success).toBe(false);
    });

    it('should reject malformed JSON syntax gracefully without crashing', () => {
      const malformedJson = '{ "version": "1.0.0", "data": { "player": { x: 100, broken } }';
      const result = engine.importSaveFile(malformedJson);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    it('should reject JSON primitives and arrays as root', () => {
      expect(engine.importSaveFile('12345').success).toBe(false);
      expect(engine.importSaveFile('"just a string"').success).toBe(false);
      expect(engine.importSaveFile('[{"player": true}]').success).toBe(false);
    });

    it('should reject saves missing or corrupt player coordinates', () => {
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      
      // Corrupt player x
      delete parsed.data.player.x;
      const res1 = engine.importSaveFile(JSON.stringify(parsed));
      expect(res1.success).toBe(false);
      expect(res1.error).toContain('player position');

      // Invalid type
      parsed.data.player.x = "one thousand";
      const res2 = engine.importSaveFile(JSON.stringify(parsed));
      expect(res2.success).toBe(false);
      expect(res2.error).toContain('player position');
    });

    it('should reject saves missing or corrupt ensemble roster', () => {
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      
      parsed.data.ensemble.members = "not-an-array";
      const res = engine.importSaveFile(JSON.stringify(parsed));
      expect(res.success).toBe(false);
      expect(res.error).toContain('ensemble');
    });

    it('should reject saves missing or corrupt wallet currency', () => {
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      
      parsed.data.wallet.gold = "rich";
      const res = engine.importSaveFile(JSON.stringify(parsed));
      expect(res.success).toBe(false);
      expect(res.error).toContain('wallet');
    });

    it('should reject saves with corrupt core arrays (harmoniDex, badges, quests, repertoire)', () => {
      const exportedJson = engine.exportSaveFile();
      
      const parsed1 = JSON.parse(exportedJson);
      parsed1.data.harmoniDex = null;
      expect(engine.importSaveFile(JSON.stringify(parsed1)).success).toBe(false);

      const parsed2 = JSON.parse(exportedJson);
      parsed2.data.badges = {};
      expect(engine.importSaveFile(JSON.stringify(parsed2)).success).toBe(false);

      const parsed3 = JSON.parse(exportedJson);
      parsed3.data.quests = "all done";
      expect(engine.importSaveFile(JSON.stringify(parsed3)).success).toBe(false);

      const parsed4 = JSON.parse(exportedJson);
      parsed4.data.repertoire = 100;
      expect(engine.importSaveFile(JSON.stringify(parsed4)).success).toBe(false);
    });

    it('should reject saves with missing currentZone', () => {
      const exportedJson = engine.exportSaveFile();
      const parsed = JSON.parse(exportedJson);
      parsed.data.currentZone = 999;
      const res = engine.importSaveFile(JSON.stringify(parsed));
      expect(res.success).toBe(false);
      expect(res.error).toContain('currentZone');
    });
  });

  // =========================================================================
  // 4. UI INTEGRATION & FILE READER SIMULATION
  // =========================================================================
  describe('4. UI Integration & File I/O Triggers', () => {
    let ui: HarmoniaUI;

    beforeEach(() => {
      document.body.innerHTML = `
        <div class="floating-toolbar">
          <button id="btn-export-save" class="tool-btn">💾</button>
          <button id="btn-import-save" class="tool-btn">📂</button>
          <button id="btn-system" class="tool-btn">⚙️</button>
        </div>
        <input type="file" id="file-input-import" accept=".json" style="display: none;" />
        <div id="modal-system" class="modal-overlay hidden">
          <div id="system-body"></div>
        </div>
      `;

      // Mock URL object methods
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-uuid');
      global.URL.revokeObjectURL = vi.fn();
      global.alert = vi.fn();

      ui = new HarmoniaUI(engine);
    });

    it('should trigger browser download of formatted JSON when export is called', () => {
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      ui.triggerExportSave();

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      const toast = document.querySelector('.harmonia-toast');
      expect(toast?.innerHTML).toContain('Exported save to');
    });

    it('should trigger file input click when import is initiated', () => {
      const fileInput = document.getElementById('file-input-import') as HTMLInputElement;
      const clickSpy = vi.spyOn(fileInput, 'click');

      ui.triggerImportSave();
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should process uploaded JSON file via FileReader and alert success', () => {
      const validExport = engine.exportSaveFile();
      const mockFile = new File([validExport], 'harmonia_save.json', { type: 'application/json' });

      // Mock FileReader
      class MockFileReader {
        public onload: any = null;
        public onerror: any = null;
        public result: any = null;
        public readAsText(file: File) {
          this.result = validExport;
          if (this.onload) {
            this.onload({ target: { result: this.result } });
          }
        }
      }
      (global as any).FileReader = MockFileReader;

      ui.handleImportFile(mockFile);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Save file imported successfully')
      );
      const toast = document.querySelector('.harmonia-toast');
      expect(toast?.innerHTML).toContain('Save file imported successfully');
    });

    it('should alert error if uploaded file contains corrupted JSON', () => {
      const corruptFile = new File(['invalid json data'], 'broken.json', { type: 'application/json' });

      class MockFileReader {
        public onload: any = null;
        public onerror: any = null;
        public result: any = null;
        public readAsText(file: File) {
          this.result = 'invalid json data';
          if (this.onload) {
            this.onload({ target: { result: this.result } });
          }
        }
      }
      (global as any).FileReader = MockFileReader;

      ui.handleImportFile(corruptFile);

      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Error importing save file')
      );
    });

    it('should include Export Save in system menu persistence section and save toast', () => {
      ui.renderSystemMenuModal();
      const btnActionExport = document.getElementById('btn-action-export');
      const btnActionImport = document.getElementById('btn-action-import');

      expect(btnActionExport).not.toBeNull();
      expect(btnActionImport).not.toBeNull();

      // Trigger Save Progress
      const btnSave = document.getElementById('btn-action-save');
      btnSave?.click();

      const toast = document.querySelector('.harmonia-toast');
      expect(toast?.innerHTML).toContain('toast-export-btn');
      expect(toast?.innerHTML).toContain('Export Save');
    });
  });
});
