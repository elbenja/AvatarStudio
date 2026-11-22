import { useMemo } from 'react';
import { characterById, type Character } from '../avatar/characters';
import type { CharacterId, Mood } from '../avatar/types';
import { useDownloads, type SaveState } from '../hooks/useDownloads';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { useStudio, type StudioState } from './studio';

/** What a layout template receives: the state, named actions, and the downloads. Templates own no studio state. */
export interface StudioController {
  state: StudioState;
  character: Character;
  actions: {
    setWho: (id: CharacterId) => void;
    setMood: (mood: Mood) => void;
    nextMood: () => void;
    setMoving: (moving: boolean) => void;
    setSpeed: (v: number) => void;
    setBounce: (v: number) => void;
    setTurn: (v: number) => void;
    resetView: () => void;
    togglePause: () => void;
  };
  downloads: { png: SaveState; html: SaveState; savePng: () => void; saveHtml: () => void };
}

/** A layout template: the controller, plus whether the stage may start its 3D yet. */
export type StudioTemplateProps = StudioController & { live?: boolean };

export function useStudioController(onDownloaded?: () => void): StudioController {
  const calm = usePrefersReducedMotion();
  const [state, dispatch] = useStudio(calm);
  const character = characterById(state.who);
  const downloads = useDownloads(character, onDownloaded);

  const actions = useMemo<StudioController['actions']>(() => ({
    setWho: (who) => dispatch({ type: 'who', who }),
    setMood: (mood) => dispatch({ type: 'mood', mood }),
    nextMood: () => dispatch({ type: 'nextMood' }),
    setMoving: (moving) => dispatch({ type: 'moving', moving }),
    setSpeed: (speed) => dispatch({ type: 'speed', speed }),
    setBounce: (bounce) => dispatch({ type: 'bounce', bounce }),
    setTurn: (turn) => dispatch({ type: 'turn', turn }),
    resetView: () => dispatch({ type: 'turn', turn: 0 }),
    togglePause: () => dispatch({ type: 'togglePause' }),
  }), []);

  return { state, character, actions, downloads };
}
