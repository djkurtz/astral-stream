import { describe, it, expect, beforeEach } from 'vitest';
import { soundEngine } from '../src/audio';

describe('Adaptive Biome Soundscapes & Positional Audio', () => {
  beforeEach(() => {
    soundEngine.setBiome('plaza');
  });

  it('should track player coordinates and switch active biome correctly', () => {
    // Port Resonata (Southwest Dunes: y > 1850, x < 1400)
    soundEngine.updatePlayerPosition(600, 2000);
    expect((soundEngine as any).currentBiome).toBe('beach');

    // Whispering Bamboo Grove (East: x > 2100, y > 950)
    soundEngine.updatePlayerPosition(2400, 1400);
    expect((soundEngine as any).currentBiome).toBe('grove');

    // Ancient Sound Ruins (Northeast: x > 1800, y <= 950)
    soundEngine.updatePlayerPosition(2500, 600);
    expect((soundEngine as any).currentBiome).toBe('ruins');

    // Desolation Ridge (Northwest: x <= 1300, y <= 1050)
    soundEngine.updatePlayerPosition(600, 600);
    expect((soundEngine as any).currentBiome).toBe('ridge');

    // Cadence Plaza (Center default)
    soundEngine.updatePlayerPosition(1600, 1400);
    expect((soundEngine as any).currentBiome).toBe('plaza');
  });

  it('should support explicit biome override', () => {
    soundEngine.setBiome('ridge');
    expect((soundEngine as any).currentBiome).toBe('ridge');
    soundEngine.setBiome('beach');
    expect((soundEngine as any).currentBiome).toBe('beach');
  });
});
