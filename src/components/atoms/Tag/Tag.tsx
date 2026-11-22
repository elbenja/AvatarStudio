import type { CSSProperties } from 'react';
import './Tag.css';

export interface TagProps {
  label: string;
  /** Seconds into the float, so a group of tags bobs out of step. */
  delay?: number;
}

/** A soft label that floats. A new label rolls in instead of popping. */
export function Tag({ label, delay = 0 }: TagProps) {
  return (
    <span className="sd-tag" style={{ '--d': `-${delay}s` } as CSSProperties}>
      <span key={label} className="sd-tag-text">{label}</span>
    </span>
  );
}
