import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { WORLD_ZONES, INITIAL_WORLD_NPCS, WorldZone, ZoneId } from '../src/data';

describe('Road Connectivity, Bidirectional Transitions & Signpost Topology', () => {
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
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  // Helper to check if a coordinate collides with any solid obstacle in a zone
  function isCollidingWithZoneObstacles(zone: WorldZone, x: number, y: number, playerRadius = 16): boolean {
    for (const obs of zone.obstacles) {
      if ((obs.type === 'box' || obs.type === 'building') && obs.w && obs.h) {
        if (x >= obs.x && x <= obs.x + obs.w && y >= obs.y && y <= obs.y + obs.h) {
          return true;
        }
      } else if (obs.type === 'circle' && obs.radius) {
        if (Math.hypot(x - obs.x, y - obs.y) < obs.radius + playerRadius) {
          return true;
        }
      }
    }
    return false;
  }

  describe('1. Bidirectional Zone Transitions & Topological Connectivity', () => {
    it('should define all 9 required world zones with valid dimensions and spawn points', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        expect(zone, `Zone ${zoneId} must exist in WORLD_ZONES`).toBeDefined();
        expect(zone.width, `Zone ${zoneId} width must be positive`).toBeGreaterThan(0);
        expect(zone.height, `Zone ${zoneId} height must be positive`).toBeGreaterThan(0);
        expect(zone.transitions.length, `Zone ${zoneId} must have at least one transition`).toBeGreaterThan(0);
        expect(zone.defaultSpawn, `Zone ${zoneId} must define a default spawn`).toBeDefined();
        expect(zone.defaultSpawn.x).toBeGreaterThanOrEqual(0);
        expect(zone.defaultSpawn.x).toBeLessThanOrEqual(zone.width);
        expect(zone.defaultSpawn.y).toBeGreaterThanOrEqual(0);
        expect(zone.defaultSpawn.y).toBeLessThanOrEqual(zone.height);

        // Verify defaultSpawn does not collide with obstacles
        const collides = isCollidingWithZoneObstacles(zone, zone.defaultSpawn.x, zone.defaultSpawn.y);
        expect(collides, `Default spawn for ${zoneId} (${zone.defaultSpawn.x}, ${zone.defaultSpawn.y}) must not collide with obstacles`).toBe(false);
      }
    });

    it('should guarantee bidirectional transitions for every transition between zones (A -> B implies B -> A)', () => {
      const transitionPairs: Array<{ from: ZoneId; to: ZoneId; trId: string }> = [];

      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        for (const tr of zone.transitions) {
          transitionPairs.push({ from: zoneId, to: tr.targetZone, trId: tr.id });
        }
      }

      // We expect 16 total directed transitions connecting the 9 zones
      expect(transitionPairs.length).toBe(16);

      for (const { from, to, trId } of transitionPairs) {
        const targetZone = WORLD_ZONES[to];
        expect(targetZone, `Target zone ${to} for transition ${trId} must exist`).toBeDefined();

        const returnTransition = targetZone.transitions.find(tr => tr.targetZone === from);
        expect(
          returnTransition,
          `Reciprocity failed: Transition ${trId} leads from ${from} to ${to}, but ${to} has no return transition to ${from}`
        ).toBeDefined();
      }
    });

    it('should verify all targetSpawn coordinates are within zone dimensions and do not collide with obstacle boxes', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const sourceZone = WORLD_ZONES[zoneId];
        for (const tr of sourceZone.transitions) {
          const targetZone = WORLD_ZONES[tr.targetZone];
          const spawn = tr.targetSpawn;

          // 1. Within zone boundaries
          expect(
            spawn.x,
            `Spawn X (${spawn.x}) for transition ${tr.id} into ${tr.targetZone} must be within (0, ${targetZone.width})`
          ).toBeGreaterThan(0);
          expect(
            spawn.x,
            `Spawn X (${spawn.x}) for transition ${tr.id} into ${tr.targetZone} must be within (0, ${targetZone.width})`
          ).toBeLessThan(targetZone.width);

          expect(
            spawn.y,
            `Spawn Y (${spawn.y}) for transition ${tr.id} into ${tr.targetZone} must be within (0, ${targetZone.height})`
          ).toBeGreaterThan(0);
          expect(
            spawn.y,
            `Spawn Y (${spawn.y}) for transition ${tr.id} into ${tr.targetZone} must be within (0, ${targetZone.height})`
          ).toBeLessThan(targetZone.height);

          // 2. Direct obstacle collision check
          const collidesDirect = isCollidingWithZoneObstacles(targetZone, spawn.x, spawn.y);
          expect(
            collidesDirect,
            `Target spawn (${spawn.x}, ${spawn.y}) for transition ${tr.id} into ${tr.targetZone} collides with an obstacle`
          ).toBe(false);

          // 3. Engine checkObstacleCollision verification
          (engine as any).state.currentZone = tr.targetZone;
          const engineCollision = (engine as any).checkObstacleCollision(spawn.x, spawn.y);
          expect(
            engineCollision,
            `Engine reports collision at target spawn (${spawn.x}, ${spawn.y}) for transition ${tr.id} into ${tr.targetZone}`
          ).toBe(false);
        }
      }
    });

    it('should ensure targetSpawn is safely offset from return transition bounds to prevent instant warp loops', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const sourceZone = WORLD_ZONES[zoneId];
        for (const tr of sourceZone.transitions) {
          const targetZone = WORLD_ZONES[tr.targetZone];
          const spawn = tr.targetSpawn;

          for (const targetTr of targetZone.transitions) {
            const inBounds = (
              spawn.x >= targetTr.bounds.x &&
              spawn.x <= targetTr.bounds.x + targetTr.bounds.w &&
              spawn.y >= targetTr.bounds.y &&
              spawn.y <= targetTr.bounds.y + targetTr.bounds.h
            );
            expect(
              inBounds,
              `Transition ${tr.id} spawns player at (${spawn.x}, ${spawn.y}) inside target zone transition ${targetTr.id} bounds, risking warp loop`
            ).toBe(false);
          }
        }
      }
    });

    it('should verify entire world graph is fully connected (any zone reachable from any other zone)', () => {
      for (const startZone of ALL_NINE_ZONES) {
        const visited = new Set<ZoneId>([startZone]);
        const queue: ZoneId[] = [startZone];

        while (queue.length > 0) {
          const curr = queue.shift()!;
          for (const tr of WORLD_ZONES[curr].transitions) {
            if (!visited.has(tr.targetZone)) {
              visited.add(tr.targetZone);
              queue.push(tr.targetZone);
            }
          }
        }

        expect(
          visited.size,
          `Starting from ${startZone}, only reached ${Array.from(visited).join(', ')}. Expected all 9 zones.`
        ).toBe(9);
      }
    });
  });

  describe('2. Transition Trigger Bounds & Map Edge / Gate Openings', () => {
    it('should verify transition trigger bounds line up with map edges (flush with x=0, x=width, y=0, or y=height)', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        for (const tr of zone.transitions) {
          const b = tr.bounds;
          expect(b.w, `Transition ${tr.id} bounds width must be positive`).toBeGreaterThan(0);
          expect(b.h, `Transition ${tr.id} bounds height must be positive`).toBeGreaterThan(0);

          const isLeftEdge = b.x === 0;
          const isRightEdge = b.x + b.w === zone.width;
          const isTopEdge = b.y === 0;
          const isBottomEdge = b.y + b.h === zone.height;

          const isAtEdge = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge;
          expect(
            isAtEdge,
            `Transition ${tr.id} in ${zoneId} (bounds: ${JSON.stringify(b)}, zone: ${zone.width}x${zone.height}) must be flush with a map edge`
          ).toBe(true);
        }
      }
    });

    it('should verify transition bounds correspond with physical wall gaps or gate openings', () => {
      // Cavatina Village -> East Gate (x: 1920..2000, y: 820..980)
      const cavatinaEastTr = WORLD_ZONES.cavatina_village.transitions.find(tr => tr.targetZone === 'west_wilderness')!;
      expect(cavatinaEastTr.bounds).toEqual({ x: 1920, y: 820, w: 80, h: 160 });
      const cavatinaGate = WORLD_ZONES.cavatina_village.obstacles.find(o => o.type === 'gate');
      expect(cavatinaGate).toBeDefined();
      expect(cavatinaGate?.y).toBe(820);
      expect(cavatinaGate?.h).toBe(160);

      // Woodwind Woods -> West Gate (x: 0..80, y: 820..980)
      const woodsWestTr = WORLD_ZONES.woodwind_woods.transitions.find(tr => tr.targetZone === 'east_wilderness')!;
      expect(woodsWestTr.bounds).toEqual({ x: 0, y: 820, w: 80, h: 160 });
      const woodsGate = WORLD_ZONES.woodwind_woods.obstacles.find(o => o.type === 'gate');
      expect(woodsGate).toBeDefined();
      expect(woodsGate?.y).toBe(820);
      expect(woodsGate?.h).toBe(160);

      // Brass Citadel -> South Bastion Gate (x: 920..1080, y: 1520..1600)
      const citadelSouthTr = WORLD_ZONES.brass_citadel.transitions.find(tr => tr.targetZone === 'north_wilderness')!;
      expect(citadelSouthTr.bounds).toEqual({ x: 920, y: 1520, w: 160, h: 80 });
      const citadelGate = WORLD_ZONES.brass_citadel.obstacles.find(o => o.type === 'gate');
      expect(citadelGate).toBeDefined();
      expect(citadelGate?.x).toBe(920);
      expect(citadelGate?.w).toBe(160);

      // Percussion Peaks -> North Summit Gate (x: 920..1080, y: 0..80)
      const peaksNorthTr = WORLD_ZONES.percussion_peaks.transitions.find(tr => tr.targetZone === 'south_wilderness')!;
      expect(peaksNorthTr.bounds).toEqual({ x: 920, y: 0, w: 160, h: 80 });
      const peaksGate = WORLD_ZONES.percussion_peaks.obstacles.find(o => o.type === 'gate');
      expect(peaksGate).toBeDefined();
      expect(peaksGate?.x).toBe(920);
      expect(peaksGate?.w).toBe(160);
    });

    it('should simulate moving the player through all 16 transition bounds and verify successful warps', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        for (const tr of zone.transitions) {
          // Set player inside source zone
          engine.warpToZone(zoneId, { x: 500, y: 500, dir: 'down' });
          expect(engine.getState().currentZone).toBe(zoneId);

          // Position player directly at the center of the transition trigger bounds
          const centerX = tr.bounds.x + tr.bounds.w / 2;
          const centerY = tr.bounds.y + tr.bounds.h / 2;
          engine.getState().player.x = centerX;
          engine.getState().player.y = centerY;

          // Simulate movement update to trigger transition check
          engine.handleKeyDown('ArrowRight');
          engine.update(0.016);
          engine.handleKeyUp('ArrowRight');

          // Verify player was warped to targetZone at targetSpawn
          const state = engine.getState();
          expect(state.currentZone, `Transition ${tr.id} did not warp to target zone ${tr.targetZone}`).toBe(tr.targetZone);
          expect(state.player.x).toBe(tr.targetSpawn.x);
          expect(state.player.y).toBe(tr.targetSpawn.y);
          expect(state.player.dir).toBe(tr.targetSpawn.dir);
          expect(state.discoveredZones[tr.targetZone]).toBe(true);
        }
      }
    });
  });

  describe('3. Signpost Correctness & Directional Topology Audit', () => {
    it('should verify all 9 world zones have exactly one signpost or trail marker in INITIAL_WORLD_NPCS', () => {
      const signposts = INITIAL_WORLD_NPCS.filter(npc => npc.actionType === 'signpost');
      expect(signposts.length).toBe(9);

      for (const zoneId of ALL_NINE_ZONES) {
        const sign = signposts.find(s => s.zone === zoneId);
        expect(sign, `Zone ${zoneId} must have a signpost NPC`).toBeDefined();
        expect(sign?.isProp).toBe(true);
        expect(sign?.dialogue && sign.dialogue.length > 0).toBe(true);
      }
    });

    it('should verify Cavatina Village signpost directs East toward Lyre Valley and Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_village_signpost')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('cavatina_village');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('CAVATINA VILLAGE');
      expect(fullText).toContain('WESTERN STRINGS');
      expect(fullText).toContain('➡️ EAST GATE');
      expect(fullText).toContain('Lyre Valley');
      expect(fullText).toContain('Grand Symphony Hub');
    });

    it('should verify Lyre Valley (West Wilderness) marker correctly directs West to Cavatina and East to Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_sign_west_wilds')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('west_wilderness');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('LYRE VALLEY');
      expect(fullText).toContain('WEST WILDERNESS');
      expect(fullText).toContain('⬅️ WEST');
      expect(fullText).toContain('Cavatina Village');
      expect(fullText).toContain('➡️ EAST');
      expect(fullText).toContain('The Central City');
    });

    it('should verify Woodwind Woods signpost directs West toward Breeze Glade and Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_signpost_woods')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('woodwind_woods');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('WOODWIND WOODS');
      expect(fullText).toContain('EASTERN CANOPY VILLAGE');
      expect(fullText).toContain('⬅️ WEST GATE');
      expect(fullText).toContain('Breeze Glade');
      expect(fullText).toContain('Central City');
    });

    it('should verify Breeze Glade (East Wilderness) marker correctly directs East to Woodwinds and West to Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_sign_east_wilds')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('east_wilderness');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('BREEZE GLADE');
      expect(fullText).toContain('EAST WILDERNESS');
      expect(fullText).toContain('➡️ EAST');
      expect(fullText).toContain('Woodwind Woods');
      expect(fullText).toContain('⬅️ WEST');
      expect(fullText).toContain('The Central City');
    });

    it('should verify The Brass Citadel signpost directs South toward Echo Canyon and Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_signpost_citadel')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('brass_citadel');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('THE BRASS CITADEL');
      expect(fullText).toContain('NORTHERN GILDED BASTION');
      expect(fullText).toContain('⬇️ SOUTH BASTION');
      expect(fullText).toContain('Echo Canyon');
      expect(fullText).toContain('Central City');
    });

    it('should verify Echo Canyon (North Wilderness) marker correctly directs North to Brass Citadel and South to Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_sign_north_wilds')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('north_wilderness');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('ECHO CANYON');
      expect(fullText).toContain('NORTH WILDERNESS');
      expect(fullText).toContain('⬆️ NORTH');
      expect(fullText).toContain('The Brass Citadel');
      expect(fullText).toContain('⬇️ SOUTH');
      expect(fullText).toContain('The Central City');
    });

    it('should verify Percussion Peaks signpost directs North toward Rumble Gorge and Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_signpost_peaks')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('percussion_peaks');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('PERCUSSION PEAKS');
      expect(fullText).toContain('SOUTHERN TAIKO GHATS');
      expect(fullText).toContain('⬆️ NORTH SUMMIT');
      expect(fullText).toContain('Rumble Gorge');
      expect(fullText).toContain('Central City');
    });

    it('should verify Rumble Gorge (South Wilderness) marker correctly directs South to Percussion Peaks and North to Central City', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_sign_south_wilds')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('south_wilderness');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('RUMBLE GORGE');
      expect(fullText).toContain('SOUTH WILDERNESS');
      expect(fullText).toContain('⬇️ SOUTH');
      expect(fullText).toContain('Percussion Peaks');
      expect(fullText).toContain('⬆️ NORTH');
      expect(fullText).toContain('The Central City');
    });

    it('should verify The Central City (Grand Hall) compass signpost directs to all 4 cardinal villages/wildernesses correctly', () => {
      const sign = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_signpost_grand_hall')!;
      expect(sign).toBeDefined();
      expect(sign.zone).toBe('grand_hall');

      const fullText = sign.dialogue.join(' ');
      expect(fullText).toContain('THE CENTRAL CITY');
      expect(fullText).toContain('GRAND SYMPHONY HUB');
      expect(fullText).toContain('⬅️ WEST ARCH');
      expect(fullText).toContain('Cavatina Village');
      expect(fullText).toContain('➡️ EAST GATE');
      expect(fullText).toContain('Woodwind Woods');
      expect(fullText).toContain('⬆️ NORTH COLONNADE');
      expect(fullText).toContain('The Brass Citadel');
      expect(fullText).toContain('⬇️ SOUTH GRAND BRIDGE');
      expect(fullText).toContain('Percussion Peaks');
    });

    it('should successfully trigger signpost dialogue when player approaches and interacts in each zone', () => {
      const signposts = INITIAL_WORLD_NPCS.filter(npc => npc.actionType === 'signpost');
      for (const sign of signposts) {
        // Warp player to the signpost location
        engine.warpToZone(sign.zone, { x: sign.x, y: sign.y, dir: 'up' });
        engine.updateProximity();

        const state = engine.getState();
        expect(state.nearbyInteractable?.id, `Proximity failed to target signpost ${sign.id}`).toBe(sign.id);

        engine.interactWithNearby();
        expect(state.dialogue, `Dialogue did not trigger for signpost ${sign.id}`).toBeDefined();
        expect(state.dialogue?.speaker).toBe(sign.name);
        expect(state.dialogue?.text).toEqual(sign.dialogue);

        // Advance past dialogue
        while (engine.getState().dialogue) {
          engine.advanceDialogue();
        }
        expect(engine.getState().dialogue).toBeNull();
      }
    });
  });

  describe('4. Text Cleanliness & Absence of TeX/LaTeX Artifacts', () => {
    const latexPatterns = [
      /\\[a-zA-Z]+/,         // e.g. \text, \frac, \rightarrow, \approx, \cdot
      /\$[^$]+\$/,           // inline math $...$
      /\\\{|\\\}/,           // escaped braces \{ \}
      /\\[(\[\])]/           // LaTeX delimiters \( \) \[ \]
    ];

    it('should ensure no LaTeX/TeX artifacts exist in any signpost dialogue or title', () => {
      const signposts = INITIAL_WORLD_NPCS.filter(npc => npc.actionType === 'signpost');
      for (const sign of signposts) {
        const textToAudit = [
          sign.name,
          sign.title || '',
          ...sign.dialogue
        ];

        for (const line of textToAudit) {
          for (const pattern of latexPatterns) {
            expect(
              pattern.test(line),
              `LaTeX artifact detected matching ${pattern} in signpost ${sign.id}: "${line}"`
            ).toBe(false);
          }
        }
      }
    });

    it('should ensure no LaTeX/TeX artifacts exist in any zone names, subtitles, or transition promptTexts', () => {
      for (const zoneId of ALL_NINE_ZONES) {
        const zone = WORLD_ZONES[zoneId];
        const texts = [zone.name, zone.subtitle, ...zone.transitions.map(t => t.promptText)];

        for (const line of texts) {
          for (const pattern of latexPatterns) {
            expect(
              pattern.test(line),
              `LaTeX artifact detected matching ${pattern} in zone ${zoneId}: "${line}"`
            ).toBe(false);
          }
        }
      }
    });
  });
});
