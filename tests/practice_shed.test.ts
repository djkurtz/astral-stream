import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';

describe('Harmonia: Practice Shed & Musicianship Grind Mechanics', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('silver_flute', 'Pip');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should start a practice drill and generate rhythmic target notes', () => {
    engine.startPracticeSession('metronome');
    const state = engine.getState();

    expect(state.mode).toBe('practice');
    expect(state.practiceSession).not.toBeNull();
    expect(state.practiceSession?.notes.length).toBeGreaterThan(0);
    expect(state.practiceSession?.score).toBe(0);
  });

  it('should accurately evaluate note hits and increase score and combo', () => {
    engine.startPracticeSession('scale_run');
    const session = engine.getState().practiceSession!;
    const targetNote = session.notes[0];

    // Simulate elapsed time matching note target time
    session.elapsedTime = targetNote.targetTime;
    engine.hitPracticeNote(targetNote.lane);

    expect(targetNote.hit).toBe(true);
    expect(targetNote.accuracy).toBe('perfect');
    expect(session.score).toBe(100);
    expect(session.combo).toBe(1);
  });

  it('should complete practice drill and award Musicianship stat points', () => {
    engine.startPracticeSession('scale_run');
    const state = engine.getState();
    const session = state.practiceSession!;
    const player = state.ensemble.members[0];
    const initialTec = player.stats.technique;

    // Simulate scoring and elapsed time reaching completion
    session.score = 600;
    session.elapsedTime = session.duration + 0.1;

    engine.update(1000);
    engine.update(1100);

    expect(session.completed).toBe(true);
    expect(player.stats.technique).toBeGreaterThan(initialTec);
    expect(state.dialogue).not.toBeNull();
    expect(state.dialogue?.speaker).toContain('Practice Complete');
  });
});
