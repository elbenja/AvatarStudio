import { useReducer } from 'react';
import type { CharacterId, Mood } from '../avatar/types';
import { EMOTIONS } from '../avatar/characters';

/** Everything the studio controls about the character on stage. Both layouts read and write this. */
export interface StudioState {
  who: CharacterId;
  mood: Mood;
  moving: boolean;
  speed: number;
  bounce: number;
  /** Camera azimuth in degrees, two-way bound to dragging the stage. */
  turn: number;
  paused: boolean;
}

export type StudioAction =
  | { type: 'who'; who: CharacterId }
  | { type: 'mood'; mood: Mood }
  | { type: 'nextMood' }
  | { type: 'moving'; moving: boolean }
  | { type: 'speed'; speed: number }
  | { type: 'bounce'; bounce: number }
  | { type: 'turn'; turn: number }
  | { type: 'togglePause' };

export const SPEED = { min: 0.2, max: 2, step: 0.05 } as const;
export const BOUNCE = { min: 0, max: 2, step: 0.05 } as const;
export const TURN = { min: -180, max: 180, step: 1, home: 35 } as const;

export function initialStudio(calm: boolean): StudioState {
  // The character starts neutral (a tap makes it smile). With reduced motion it starts standing and moves gently.
  return { who: 'bear', mood: -1, moving: !calm, speed: 1, bounce: calm ? 0.4 : 1, turn: TURN.home, paused: false };
}

export function studioReducer(s: StudioState, a: StudioAction): StudioState {
  switch (a.type) {
    case 'who': return s.who === a.who ? s : { ...s, who: a.who };
    case 'mood': return s.mood === a.mood ? s : { ...s, mood: a.mood };
    case 'nextMood': return { ...s, mood: (s.mood + 1) % EMOTIONS.length };
    case 'moving': return { ...s, moving: a.moving };
    // Moving the speed slider is a clear wish to see motion: it also un-pauses.
    case 'speed': return { ...s, speed: a.speed, paused: false };
    case 'bounce': return { ...s, bounce: a.bounce };
    case 'turn': return s.turn === a.turn ? s : { ...s, turn: a.turn };
    case 'togglePause': return { ...s, paused: !s.paused };
  }
}

export function useStudio(calm: boolean) {
  return useReducer(studioReducer, calm, initialStudio);
}
