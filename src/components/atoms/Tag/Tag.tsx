import type { CSSProperties } from 'react';
import './Tag.css';

export interface TagProps {
  label: string;
  /** Seconds into the float, so a group of tags bobs out of step. */
  delay?: number;
  /** The surface it floats over: the About card's cool wash, or one step darker than the page canvas. */
  tone?: 'card' | 'canvas';
}

/** A soft label that floats. A new label rolls in instead of popping. */
export function Tag({ label, delay = 0, tone = 'card' }: TagProps) {
  return (
    <span className={'sd-tag' + (tone === 'canvas' ? ' sd-tag--canvas' : '')} style={{ '--d': `-${delay}s` } as CSSProperties}>
      <span key={label} className="sd-tag-text">{label}</span>
    </span>
  );
}
