import type { CSSProperties } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import './Swatch.css';

export interface SwatchProps {
  color: string;
  label: string;
  on: boolean;
  onPick: () => void;
}

/** One character's colour: a 12px chip with a 44px hit area. */
export function Swatch({ color, label, on, onPick }: SwatchProps) {
  return (
    <Tooltip label={label}>
      <button type="button" className={'sd-swatch' + (on ? ' is-on' : '')} aria-label={label} aria-pressed={on} onClick={onPick}>
        <span className="sd-swatch-chip" style={{ '--c': color } as CSSProperties} />
      </button>
    </Tooltip>
  );
}
