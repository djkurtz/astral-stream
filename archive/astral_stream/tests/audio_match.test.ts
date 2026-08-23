import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { TOWN_SOUND_RIPPLES, ALLEGRO_OWL_SPIRIT } from '../src/data';

describe('Audio Match Radar & Minigames', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should start waveform equalizer scan and align frequencies', () => {
    const waveRipple = TOWN_SOUND_RIPPLES.find(r => r.challengeType === 'waveform_slider')!;
    engine.startAudioMatchScan(waveRipple);

    const match = engine.getState().audioMatch;
    expect(match).toBeDefined();
    expect(match?.challengeType).toBe('waveform_slider');
    expect(match?.spiritToUnlock.id).toBe(ALLEGRO_OWL_SPIRIT.id);

    // Set player frequency to match target
    engine.setPlayerFrequency(match!.targetFreq);
    expect(match?.playerFreq).toBe(match?.targetFreq);
  });

  it('should process call and response melody input correctly', () => {
    const melodyRipple = TOWN_SOUND_RIPPLES.find(r => r.challengeType === 'call_response')!;
    engine.startAudioMatchScan(melodyRipple);

    const match = engine.getState().audioMatch!;
    match.isListeningToPlayer = true;
    const targetSeq = match.melodySequence;

    // Input matching notes
    targetSeq.forEach(note => {
      engine.inputMelodyPad(note);
    });

    expect(match.playerSequence.length).toBe(targetSeq.length);
  });

  it('should increment combo on rhythm pulse hit during active pulse', () => {
    const pulseRipple = TOWN_SOUND_RIPPLES.find(r => r.challengeType === 'rhythm_pulse')!;
    engine.startAudioMatchScan(pulseRipple);

    const match = engine.getState().audioMatch!;
    // Set pulse radius to match target radius
    match.pulseRadius = match.targetRadius;
    engine.hitRhythmPulse();

    expect(match.combo).toBeGreaterThanOrEqual(1);
    expect(match.feedback).toContain('ON BEAT');
  });

  it('should unlock creature and mark ripple discovered on completeAudioMatch', () => {
    const waveRipple = TOWN_SOUND_RIPPLES.find(r => r.challengeType === 'waveform_slider')!;
    engine.startAudioMatchScan(waveRipple);
    
    engine.completeAudioMatch();
    expect(engine.getState().audioMatch?.isComplete).toBe(true);
  });
});
