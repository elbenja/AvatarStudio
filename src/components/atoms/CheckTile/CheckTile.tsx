import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import './CheckTile.css';

export interface CheckTileProps {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
  disabled?: boolean;
  /** A short status after the label, e.g. "Soon". */
  badge?: string;
}

/** One choice in a pick-several set: a checkbox the size of a row. */
export function CheckTile({ label, on, onChange, disabled, badge }: CheckTileProps) {
  return (
    <label className={'sd-check' + (on ? ' is-on' : '') + (disabled ? ' is-disabled' : '')}>
      <input type="checkbox" className="sd-visually-hidden" checked={on} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="sd-check-box"><Icon glyph="check" /></span>
      <span className="sd-check-label">{label}</span>
      {badge && <Badge label={badge} />}
    </label>
  );
}
