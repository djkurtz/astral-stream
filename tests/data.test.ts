import { describe, it, expect } from 'vitest';
import {
  STARTER_SPIRIT,
  ALLEGRO_OWL_SPIRIT,
  SITAR_SWAN_SPIRIT,
  TAIKO_TANUKI_SPIRIT,
  BRASS_BUNNY_SPIRIT,
  JAX_SPIRIT,
  FUSED_CHIMERA,
  BOSS_SIGNAL_OVERLORD,
  TOWN_NPCS,
  TOWN_SOUND_RIPPLES
} from '../src/data';

describe('Harmonimals & Data Integrity', () => {
  const spirits = [
    STARTER_SPIRIT,
    ALLEGRO_OWL_SPIRIT,
    SITAR_SWAN_SPIRIT,
    TAIKO_TANUKI_SPIRIT,
    BRASS_BUNNY_SPIRIT,
    JAX_SPIRIT,
    FUSED_CHIMERA
  ];

  it('should have valid stats and instruments for all Harmonimals', () => {
    spirits.forEach(spirit => {
      expect(spirit.id).toBeTruthy();
      expect(spirit.name).toBeTruthy();
      expect(spirit.species).toBeTruthy();
      expect(spirit.instrument).toBeTruthy();
      expect(spirit.originTradition).toBeTruthy();
      expect(spirit.hp).toBeGreaterThan(0);
      expect(spirit.maxHp).toBeGreaterThan(0);
      expect(spirit.attack).toBeGreaterThan(0);
      expect(spirit.moves.length).toBeGreaterThanOrEqual(2);
      
      spirit.moves.forEach(move => {
        expect(move.id).toBeTruthy();
        expect(move.name).toBeTruthy();
        expect(move.power).toBeGreaterThan(0);
        expect(move.soundType).toBeTruthy();
      });
    });
  });

  it('should verify Dead Channel 000 boss specifications', () => {
    expect(BOSS_SIGNAL_OVERLORD.id).toBe('boss_signal_overlord');
    expect(BOSS_SIGNAL_OVERLORD.type).toBe('static');
    expect(BOSS_SIGNAL_OVERLORD.hp).toBe(180);
    expect(BOSS_SIGNAL_OVERLORD.moves.length).toBe(2);
  });

  it('should verify town NPCs and Glitch Gate presence', () => {
    expect(TOWN_NPCS.length).toBeGreaterThanOrEqual(4);
    const gate = TOWN_NPCS.find(n => n.id === 'npc_gate');
    expect(gate).toBeDefined();
    expect(gate?.title).toContain('Static Anomaly Rift');

    const jax = TOWN_NPCS.find(n => n.id === 'npc_jax');
    expect(jax).toBeDefined();
    expect(jax?.actionType).toBe('battle_jax');
  });

  it('should verify the 3 cultural sound discovery ripples', () => {
    expect(TOWN_SOUND_RIPPLES.length).toBe(3);
    const types = TOWN_SOUND_RIPPLES.map(r => r.challengeType);
    expect(types).toContain('waveform_slider');
    expect(types).toContain('call_response');
    expect(types).toContain('rhythm_pulse');
  });
});
