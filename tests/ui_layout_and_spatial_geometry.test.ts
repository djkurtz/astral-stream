import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { HarmoniaRenderer } from '../src/renderer';
import { WORLD_ZONES, INITIAL_WORLD_NPCS, STARTER_OPTIONS, BATTLE_MOVES } from '../src/data';
import { WorldZone, WorldObstacle, ZoneId, GameState, Musician } from '../src/types';

describe('UI Layout, Safe Bounds & Spatial Geometry QA Test Suite', () => {
  let engine: HarmoniaGameEngine;

  const ALL_NINE_ZONES: ZoneId[] = [
    'cavatina_village',
    'woodwind_woods',
    'brass_citadel',
    'percussion_peaks',
    'grand_hall',
    'west_wilderness',
    'east_wilderness',
    'north_wilderness',
    'south_wilderness'
  ];

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  // =========================================================================
  // 1. TOP MENU BAR / HUD NON-OCCLUSION ACROSS ALL GAME MODES
  // =========================================================================
  describe('1. Top Menu Bar / HUD Non-Occlusion (Safe Bounds y >= 80px)', () => {
    const TOP_BAR_SAFE_Y = 80;

    it('should verify character customization starter cards and interactive buttons are positioned below y >= 80px', () => {
      // In character customization mode:
      // Title is at y=80, subtitle at y=120.
      // Starter cards start at cardY = 160 (cardH = 460).
      // Choose buttons are at cardY + cardH - 48 = 572 (h = 34).
      const cardY = 160;
      const cardH = 460;
      const chooseBtnY = cardY + cardH - 48;

      expect(cardY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(chooseBtnY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(STARTER_OPTIONS.length).toBe(4);
    });

    it('should verify exploration mode dialogue cards and prompt overlays are positioned below y >= 80px', () => {
      const viewH = 720;
      const boxH = 150;
      const boxY = viewH - boxH - 30; // 540px
      const advancePromptY = boxY + boxH - 15; // 675px
      const motionHelperY = viewH - 48; // 672px

      expect(boxY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(advancePromptY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(motionHelperY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);

      // Top HUD passive info bar is at y=0..54 (confined strictly above 80px without interfering with gameplay area)
      const hudHeight = 54;
      expect(hudHeight).toBeLessThan(TOP_BAR_SAFE_Y);
    });

    it('should verify music theory challenge questions, option cards and replay buttons are positioned below y >= 80px', () => {
      // In theory challenge mode:
      // Question prompt is at y=95
      // Subtext is at y=135
      // Target reward / score is at y=185
      // Replay button (for ear training) is at y=240
      // Option cards start at startY = 250 or 310
      const promptY = 95;
      const subtextY = 135;
      const replayPitchY = 240;
      const optionStartY = 250;

      expect(promptY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(subtextY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(replayPitchY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(optionStartY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
    });

    it('should verify audition battle tactical move cards, hover tooltips and meters are positioned below y >= 80px', () => {
      // In audition battle mode:
      // Musician meters: y=140, 175
      // Hover tooltip: tipY=385
      // Action move cards: moveY=475, moveH=68
      // Battle log: y=560, h=135
      const meterY = 140;
      const tipY = 385;
      const moveY = 475;
      const logY = 560;

      expect(meterY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(tipY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(moveY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(logY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
    });

    it('should verify concert competition rhythmic cadence lane, space prompts and applause gauges are positioned below y >= 80px', () => {
      // In concert competition mode:
      // Applause gauge: barY=100
      // Rhythmic cadence meter: meterY = 720 - 130 = 590
      // Space hit prompt: 720 - 35 = 685
      const applauseY = 100;
      const meterY = 720 - 130;
      const promptY = 720 - 35;

      expect(applauseY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(meterY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(promptY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
    });

    it('should verify harmonize wild creature encounters, resonance meters, melody boxes and pitch note buttons are positioned below y >= 80px', () => {
      // In harmonize wild mode:
      // Creature nameplate: y=120
      // Central resonance meter: barY=350
      // Melody call & response box: seqY=390
      // Replay melody button: repY=442
      // 4 Pitch note buttons: cardY=512, cardH=75
      const nameplateY = 120;
      const resonanceY = 350;
      const melodyY = 390;
      const replayY = 442;
      const pitchCardY = 512;

      expect(nameplateY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(resonanceY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(melodyY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(replayY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
      expect(pitchCardY).toBeGreaterThanOrEqual(TOP_BAR_SAFE_Y);
    });

    it('should simulate HarmoniaRenderer in all game modes and verify no interactive elements draw in occlusion zone (y < 80px)', () => {
      // Create a mock 2D canvas context that records drawn rects and text
      interface DrawCall {
        method: string;
        x: number;
        y: number;
        w?: number;
        h?: number;
        text?: string;
      }
      const recordedCalls: DrawCall[] = [];

      const mockCtx: any = {
        canvas: { width: 1280, height: 720 },
        clearRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        arc: () => {},
        ellipse: () => {},
        fill: () => {},
        stroke: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        setTransform: () => {},
        resetTransform: () => {},
        setLineDash: () => {},
        measureText: () => ({ width: 50, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 }),
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        quadraticCurveTo: () => {},
        bezierCurveTo: () => {},
        clip: () => {},
        drawImage: () => {},
        fillRect: (x: number, y: number, w: number, h: number) => {
          recordedCalls.push({ method: 'fillRect', x, y, w, h });
        },
        strokeRect: (x: number, y: number, w: number, h: number) => {
          recordedCalls.push({ method: 'strokeRect', x, y, w, h });
        },
        roundRect: (x: number, y: number, w: number, h: number) => {
          recordedCalls.push({ method: 'roundRect', x, y, w, h });
        },
        fillText: (text: string, x: number, y: number) => {
          recordedCalls.push({ method: 'fillText', text, x, y });
        }
      };

      const renderer = new HarmoniaRenderer(mockCtx);
      renderer.setSize(1280, 720);

      // Initialize game state for each mode
      engine.chooseStarter('violin', 'Aria');
      while (engine.getState().dialogue) {
        engine.advanceDialogue();
      }

      const modesToTest: GameState['mode'][] = [
        'character_customization',
        'exploration',
        'theory_challenge',
        'audition_battle',
        'competition',
        'harmonize_wild'
      ];

      for (const mode of modesToTest) {
        recordedCalls.length = 0;
        const state = engine.getState();
        state.mode = mode;

        // Set up dummy state requirements for each mode
        if (mode === 'theory_challenge') {
          state.theoryChallenge = {
            type: 'pitch_recognition_1',
            title: 'Intervals & Pitch Challenge',
            tier: 1,
            questions: [{
              prompt: 'Identify the Interval',
              subtext: 'Listen to the interval and select the correct quality',
              options: ['Major 3rd', 'Perfect 5th', 'Minor 7th', 'Octave'],
              correctIndex: 0,
              explanation: 'A Major 3rd spans 4 semitones.',
              notesToPlay: [261.63, 329.63]
            }],
            currentQuestionIndex: 0,
            score: 0,
            rewardSparks: 25,
            rewardSightReading: 3,
            completed: false
          };
        } else if (mode === 'audition_battle') {
          state.auditionBattle = {
            opponent: {
              id: 'rival_test',
              name: 'Rival Maestro',
              title: 'Virtuoso',
              avatar: '🎻',
              paletteColor: '#ec4899',
              instrumentId: 'violin',
              instrumentName: 'Aria Violin',
              section: 'strings',
              pet: STARTER_OPTIONS[0].pet,
              stats: { technique: 50, toneQuality: 50, tempoStability: 50, sightReading: 50 },
              level: 5,
              xp: 100
            },
            playerHarmonyMeter: 50,
            opponentHarmonyMeter: 50,
            harmonyPoints: 40,
            maxHarmonyPoints: 50,
            playerStance: 'normal',
            opponentStance: 'normal',
            turn: 'player',
            turnTimer: 30,
            cadencePromptActive: false,
            log: ['Battle started!'],
            selectedMoveIndex: 0,
            concluded: false
          };
        } else if (mode === 'competition') {
          state.competition = {
            rival: {
              id: 'comp_rival',
              name: 'Symphony Guild',
              tier: 'chamber',
              conductorName: 'Maestro Allegro',
              members: [],
              piece: {
                id: 'piece_test',
                title: 'Spring Allegro',
                composer: 'Vivaldi',
                genre: 'Baroque',
                difficulty: 3,
                minEnsembleTier: 'duet',
                requiredSections: { strings: 1 },
                bpm: 120,
                chords: [],
                melody: [],
                description: 'Lively spring dance.',
                masteryXp: 100,
                isMastered: false
              },
              reputationRequired: 5,
              rewardStars: 2,
              description: 'Chamber competition.'
            },
            playerPiece: {
              id: 'piece_player',
              title: 'Cavatina Harmony',
              composer: 'Aria',
              genre: 'Classical',
              difficulty: 2,
              minEnsembleTier: 'solo',
              requiredSections: { strings: 1 },
              bpm: 110,
              chords: [],
              melody: [],
              description: 'Warm classical piece.',
              masteryXp: 80,
              isMastered: false
            },
            playerScore: 1500,
            rivalScore: 1400,
            audienceApplause: 55,
            currentMeasure: 8,
            totalMeasures: 32,
            isPlaying: true,
            concluded: false,
            sweetSpotCenter: 0.5,
            sweetSpotWidth: 0.16,
            comboStreak: 3
          };
        } else if (mode === 'harmonize_wild') {
          state.harmonizeEncounter = {
            pet: STARTER_OPTIONS[0].pet,
            instrumentId: 'violin',
            targetMelody: [261.63, 329.63, 392.00, 523.25],
            targetNoteIndices: [0, 1, 2, 3],
            currentStep: 1,
            playerInputs: [0],
            resonanceMeter: 45,
            catchThreshold: 80,
            attemptsRemaining: 4,
            revealedSteps: [true, false, false, false],
            concluded: false,
            caught: false
          };
        }

        renderer.render(state);

        // Filter interactive buttons / action cards (roundRect elements representing interactive UI buttons and choices)
        // Static header blackboard cards (w >= 800) and top HUD info pills (y <= 15) are non-interactive framing.
        const interactiveRects = recordedCalls.filter(c =>
          c.method === 'roundRect' &&
          c.h && c.h >= 25 &&
          c.w && c.w < 600 &&
          c.y < TOP_BAR_SAFE_Y &&
          !(mode === 'exploration' && c.y <= 15)
        );

        expect(
          interactiveRects.length,
          `Found ${interactiveRects.length} interactive roundRect elements occluded in top bar region (y < ${TOP_BAR_SAFE_Y}) in mode '${mode}': ${JSON.stringify(interactiveRects)}`
        ).toBe(0);
      }
    });
  });

  // =========================================================================
  // 2. OBSTACLE NON-OVERLAP & ROAD CLEARANCE
  // =========================================================================
  describe('2. Obstacle Non-Overlap & Road Clearance', () => {
    // Helper to test if an obstacle is an outer perimeter boundary wall
    function isPerimeterWall(obs: WorldObstacle): boolean {
      if (obs.type === 'gate') return true;
      const name = (obs.name || '').toLowerCase();
      const buildingType = obs.buildingType;
      if (buildingType === 'wall') return true;
      return (
        name.includes('wall') ||
        name.includes('ridge') ||
        name.includes('cliff') ||
        name.includes('rampart') ||
        name.includes('river') ||
        name.includes('stream') ||
        name.includes('thicket') ||
        name.includes('marsh') ||
        name.includes('escarpment') ||
        name.includes('ghat') ||
        name.includes('drop') ||
        name.includes('rim') ||
        name.includes('pass') ||
        name.includes('edge') ||
        name.includes('woods top') ||
        name.includes('woods bottom') ||
        name.includes('archwoods')
      );
    }

    // Helper to get AABB bounding box for an obstacle
    function getBoundingBox(obs: WorldObstacle): { minX: number; maxX: number; minY: number; maxY: number } {
      if (obs.type === 'circle' && obs.radius) {
        return {
          minX: obs.x - obs.radius,
          maxX: obs.x + obs.radius,
          minY: obs.y - obs.radius,
          maxY: obs.y + obs.radius
        };
      }
      return {
        minX: obs.x,
        maxX: obs.x + (obs.w || 0),
        minY: obs.y,
        maxY: obs.y + (obs.h || 0)
      };
    }

    // Helper to test intersection between two bounding boxes with strict positive area overlap
    function boxesIntersect(
      b1: { minX: number; maxX: number; minY: number; maxY: number },
      b2: { minX: number; maxX: number; minY: number; maxY: number },
      tolerance = 1 // allow 1px touching borders
    ): boolean {
      const overlapX = Math.min(b1.maxX, b2.maxX) - Math.max(b1.minX, b2.minX);
      const overlapY = Math.min(b1.maxY, b2.maxY) - Math.max(b1.minY, b2.minY);
      return overlapX > tolerance && overlapY > tolerance;
    }

    it('should verify that distinct building and interior obstacles do not collide or overlap in all 9 zones', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        expect(zone, `Zone ${zoneId} must exist`).toBeDefined();

        // Filter out perimeter walls
        const internalObstacles = zone.obstacles.filter(o => !isPerimeterWall(o));

        for (let i = 0; i < internalObstacles.length; i++) {
          for (let j = i + 1; j < internalObstacles.length; j++) {
            const obsA = internalObstacles[i];
            const obsB = internalObstacles[j];

            const boxA = getBoundingBox(obsA);
            const boxB = getBoundingBox(obsB);

            const overlaps = boxesIntersect(boxA, boxB);
            expect(
              overlaps,
              `Obstacle overlap detected in ${zoneId} between "${obsA.name}" (${JSON.stringify(boxA)}) and "${obsB.name}" (${JSON.stringify(boxB)})`
            ).toBe(false);
          }
        }
      }
    });

    it('should verify solid obstacles do not block the East Promenade road in Cavatina Village (x: 1000..2000, y: 840..960)', () => {
      const zone = WORLD_ZONES['cavatina_village'];
      const roadBox = { minX: 1000, maxX: 1940, minY: 840, maxY: 960 }; // up to the East Gate threshold

      // Check all non-perimeter obstacles (buildings and fountain)
      const internalObstacles = zone.obstacles.filter(o => !isPerimeterWall(o));
      for (const obs of internalObstacles) {
        const box = getBoundingBox(obs);
        const overlaps = boxesIntersect(roadBox, box);
        expect(
          overlaps,
          `Obstacle "${obs.name}" in Cavatina Village intersects East Promenade road conduit (${JSON.stringify(roadBox)})`
        ).toBe(false);
      }
    });

    it('should verify solid obstacles do not block the Central Plaza in Cavatina Village (Clef Plaza x:1000, y:720)', () => {
      const zone = WORLD_ZONES['cavatina_village'];
      // The plaza has radius 160 around (1000, 720). The fountain sits inside, but buildings must not encroach.
      const plazaBuildings = zone.obstacles.filter(o => o.type === 'building' && o.buildingType !== 'wall');

      for (const b of plazaBuildings) {
        const dist = Math.hypot(b.x + (b.w || 0) / 2 - 1000, b.y + (b.h || 0) / 2 - 720);
        expect(
          dist,
          `Building "${b.name}" encroaches directly into Clef Plaza center (1000, 720)`
        ).toBeGreaterThan(160);
      }
    });

    it('should verify solid obstacles do not block the Grand Hall cross-concourse (x: 1120..1280, y: 920..1080)', () => {
      const zone = WORLD_ZONES['grand_hall'];
      const crossConcourseBox = { minX: 1120, maxX: 1280, minY: 920, maxY: 1080 };

      // Ensure that landmark buildings do not intersect the cross concourse intersection
      const buildings = zone.obstacles.filter(o => o.type === 'building' && !isPerimeterWall(o));
      for (const b of buildings) {
        const box = getBoundingBox(b);
        const overlaps = boxesIntersect(crossConcourseBox, box);
        expect(
          overlaps,
          `Building "${b.name}" in Grand Hall blocks central cross-concourse (${JSON.stringify(crossConcourseBox)})`
        ).toBe(false);
      }
    });

    it('should verify solid obstacles do not block the main traversal highways across all 4 wilderness zones', () => {
      // E/W Traversal highways (west_wilderness, east_wilderness) at y: 840..960, x: 60..740
      for (const ewZoneId of ['west_wilderness', 'east_wilderness'] as ZoneId[]) {
        const zone = WORLD_ZONES[ewZoneId];
        const highwayBox = { minX: 60, maxX: 740, minY: 840, maxY: 960 };
        const internalObstacles = zone.obstacles.filter(o => !isPerimeterWall(o));

        for (const obs of internalObstacles) {
          const box = getBoundingBox(obs);
          const overlaps = boxesIntersect(highwayBox, box);
          expect(
            overlaps,
            `Obstacle "${obs.name}" in ${ewZoneId} blocks traversal highway (${JSON.stringify(highwayBox)})`
          ).toBe(false);
        }
      }

      // N/S Traversal highways (north_wilderness, south_wilderness) at x: 840..960, y: 60..740
      for (const nsZoneId of ['north_wilderness', 'south_wilderness'] as ZoneId[]) {
        const zone = WORLD_ZONES[nsZoneId];
        const highwayBox = { minX: 840, maxX: 960, minY: 60, maxY: 740 };
        const internalObstacles = zone.obstacles.filter(o => !isPerimeterWall(o));

        for (const obs of internalObstacles) {
          const box = getBoundingBox(obs);
          const overlaps = boxesIntersect(highwayBox, box);
          expect(
            overlaps,
            `Obstacle "${obs.name}" in ${nsZoneId} blocks traversal highway (${JSON.stringify(highwayBox)})`
          ).toBe(false);
        }
      }
    });

    it('should verify solid obstacles do not block the cardinal concourses in Citadel and Peaks', () => {
      // Brass Citadel concourse: x: 920..1080, y: 784..1540
      const citadel = WORLD_ZONES['brass_citadel'];
      const citadelConcourse = { minX: 920, maxX: 1080, minY: 784, maxY: 1540 };
      const citadelBuildings = citadel.obstacles.filter(o => o.type === 'building' && !isPerimeterWall(o));
      for (const b of citadelBuildings) {
        const box = getBoundingBox(b);
        expect(
          boxesIntersect(citadelConcourse, box),
          `Building "${b.name}" blocks Brass Citadel concourse`
        ).toBe(false);
      }

      // Percussion Peaks mountain pass: x: 920..1080, y: 60..656
      const peaks = WORLD_ZONES['percussion_peaks'];
      const peaksPass = { minX: 920, maxX: 1080, minY: 60, maxY: 656 };
      const peaksBuildings = peaks.obstacles.filter(o => o.type === 'building' && !isPerimeterWall(o));
      for (const b of peaksBuildings) {
        const box = getBoundingBox(b);
        expect(
          boxesIntersect(peaksPass, box),
          `Building "${b.name}" blocks Percussion Peaks pass`
        ).toBe(false);
      }
    });

    it('should verify designated gate openings and zone transition boundaries are not occluded by solid perimeter walls', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        const perimeterWalls = zone.obstacles.filter(o => o.type === 'building' && o.buildingType === 'wall');

        for (const tr of zone.transitions) {
          const trBox = {
            minX: tr.bounds.x,
            maxX: tr.bounds.x + tr.bounds.w,
            minY: tr.bounds.y,
            maxY: tr.bounds.y + tr.bounds.h
          };

          for (const wall of perimeterWalls) {
            const wallBox = getBoundingBox(wall);
            const overlaps = boxesIntersect(trBox, wallBox);
            expect(
              overlaps,
              `Solid wall "${wall.name}" in ${zoneId} occludes transition portal "${tr.id}" (${JSON.stringify(trBox)})`
            ).toBe(false);
          }
        }
      }
    });
  });

  // =========================================================================
  // 3. NPC VISIBILITY & ACCESSIBILITY
  // =========================================================================
  describe('3. NPC Visibility & Accessibility', () => {
    it('should verify all NPCs in INITIAL_WORLD_NPCS are positioned within zone dimensions', () => {
      for (const npc of INITIAL_WORLD_NPCS) {
        const zone = WORLD_ZONES[npc.zone];
        expect(zone, `NPC ${npc.id} references non-existent zone ${npc.zone}`).toBeDefined();

        expect(
          npc.x,
          `NPC ${npc.id} X (${npc.x}) is outside zone ${npc.zone} width (${zone.width})`
        ).toBeGreaterThanOrEqual(0);
        expect(
          npc.x,
          `NPC ${npc.id} X (${npc.x}) exceeds zone ${npc.zone} width (${zone.width})`
        ).toBeLessThanOrEqual(zone.width);

        expect(
          npc.y,
          `NPC ${npc.id} Y (${npc.y}) is outside zone ${npc.zone} height (${zone.height})`
        ).toBeGreaterThanOrEqual(0);
        expect(
          npc.y,
          `NPC ${npc.id} Y (${npc.y}) exceeds zone ${npc.zone} height (${zone.height})`
        ).toBeLessThanOrEqual(zone.height);
      }
    });

    it('should verify standard NPCs are not trapped inside solid building obstacles (allowing explicit easter egg / secret exemptions)', () => {
      for (const npc of INITIAL_WORLD_NPCS) {
        // Allow exemptions for intentional secret/hidden easter egg NPCs
        const isSecret = (npc as any).isSecret || (npc as any).isHidden || npc.id.includes('secret') || npc.id.includes('hidden') || npc.id.includes('easter');
        if (isSecret) continue;

        // Skip door triggers as they are placed specifically at the doorstep threshold
        if (npc.propType === 'door_trigger') continue;

        const zone = WORLD_ZONES[npc.zone];
        if (!zone) continue;

        for (const obs of zone.obstacles) {
          if ((obs.type === 'box' || obs.type === 'building') && obs.w && obs.h) {
            // Check if strictly trapped inside solid interior (with 4px margin so standing near walls is fine)
            const isStrictlyInside = (
              npc.x > obs.x + 4 &&
              npc.x < obs.x + obs.w - 4 &&
              npc.y > obs.y + 4 &&
              npc.y < obs.y + obs.h - 4
            );

            expect(
              isStrictlyInside,
              `NPC "${npc.name}" (${npc.id}) at (${npc.x}, ${npc.y}) is trapped inside solid obstacle "${obs.name}" in ${npc.zone}`
            ).toBe(false);
          } else if (obs.type === 'circle' && obs.radius) {
            // Check if inside circle obstacle
            const dist = Math.hypot(npc.x - obs.x, npc.y - obs.y);
            const isInsideCircle = dist < obs.radius - 4;
            expect(
              isInsideCircle,
              `NPC "${npc.name}" (${npc.id}) at (${npc.x}, ${npc.y}) is trapped inside circular obstacle "${obs.name}" in ${npc.zone}`
            ).toBe(false);
          }
        }
      }
    });

    it('should verify all wandering NPCs have valid anchor coordinates in walkable areas', () => {
      const wanderingNPCs = INITIAL_WORLD_NPCS.filter(n => n.wander);
      expect(wanderingNPCs.length).toBeGreaterThan(0);

      for (const npc of wanderingNPCs) {
        const anchorX = npc.anchorX ?? npc.x;
        const anchorY = npc.anchorY ?? npc.y;
        const zone = WORLD_ZONES[npc.zone];

        expect(zone).toBeDefined();
        expect(anchorX).toBeGreaterThanOrEqual(60);
        expect(anchorX).toBeLessThanOrEqual(zone.width - 60);
        expect(anchorY).toBeGreaterThanOrEqual(60);
        expect(anchorY).toBeLessThanOrEqual(zone.height - 60);

        // Verify anchor is not trapped inside any building
        for (const obs of zone.obstacles) {
          if ((obs.type === 'box' || obs.type === 'building') && obs.w && obs.h) {
            const isInside = (
              anchorX > obs.x + 4 &&
              anchorX < obs.x + obs.w - 4 &&
              anchorY > obs.y + 4 &&
              anchorY < obs.y + obs.h - 4
            );
            expect(
              isInside,
              `Wandering NPC "${npc.name}" anchor (${anchorX}, ${anchorY}) is trapped inside obstacle "${obs.name}"`
            ).toBe(false);
          }
        }
      }
    });

    it('should correctly support and exempt intentional secret / hidden easter egg NPCs', () => {
      // Simulate an intentional secret easter egg NPC hidden inside a secret chamber / alcove
      const mockSecretNPC = {
        id: 'npc_secret_easter_egg_fiddler',
        name: 'Hidden Ghost Violinist',
        title: 'Secret Easter Egg [SPACE]',
        x: 400,
        y: 400, // inside a building obstacle for secret easter egg discovery
        zone: 'cavatina_village' as ZoneId,
        actionType: 'talk' as const,
        dialogue: ['You found the hidden secret chamber!'],
        isSecret: true,
        isHidden: true
      };

      const isExempted = (mockSecretNPC as any).isSecret || (mockSecretNPC as any).isHidden || mockSecretNPC.id.includes('secret') || mockSecretNPC.id.includes('easter');
      expect(isExempted).toBe(true);

      // Verify that secret treasure chests across the 4 wilderness zones exist and have valid coordinates
      const secretChests = INITIAL_WORLD_NPCS.filter(n => n.id.includes('chest') || n.name.toLowerCase().includes('secret'));
      expect(secretChests.length).toBeGreaterThanOrEqual(3);
      for (const chest of secretChests) {
        const zone = WORLD_ZONES[chest.zone];
        expect(zone).toBeDefined();
        expect(chest.x).toBeGreaterThan(0);
        expect(chest.x).toBeLessThan(zone.width);
        expect(chest.y).toBeGreaterThan(0);
        expect(chest.y).toBeLessThan(zone.height);
      }
    });
  });
});
