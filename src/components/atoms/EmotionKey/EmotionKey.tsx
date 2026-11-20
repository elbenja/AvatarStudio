import { EMOTIONS } from '../../../avatar/characters';
import { FACES } from './faces';
import './EmotionKey.css';

export interface EmotionKeyProps {
  /** 0–7, an index into EMOTIONS. */
  mood: number;
  on: boolean;
  onPick: (mood: number) => void;
}

export function EmotionKey({ mood, on, onPick }: EmotionKeyProps) {
  const label = EMOTIONS[mood];
  return (
    <button
      type="button"
      className={'sd-key' + (on ? ' is-on' : '')}
      aria-label={label}
      title={label}
      aria-pressed={on}
      onClick={() => onPick(mood)}
    >
      <svg viewBox="0 0 40 28" fill="none" aria-hidden="true">{FACES[mood]}</svg>
    </button>
  );
}
