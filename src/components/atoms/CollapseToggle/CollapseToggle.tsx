import { Tooltip } from '../Tooltip/Tooltip';
import './CollapseToggle.css';

export interface CollapseToggleProps {
  open: boolean;
  /** Name of the section it folds, for the accessible label. */
  section: string;
  controls?: string;
  onToggle: (open: boolean) => void;
}

/** A "+" that folds into a "−" while its section is open. */
export function CollapseToggle({ open, section, controls, onToggle }: CollapseToggleProps) {
  const label = (open ? 'Collapse ' : 'Expand ') + section;
  return (
    <Tooltip label={label} side="left">
      <button
        type="button"
        className={'sd-add' + (open ? ' is-open' : '')}
        aria-expanded={open}
        aria-controls={controls}
        aria-label={label}
        onClick={() => onToggle(!open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path className="sd-add-v" d="M12 5v14" /></svg>
      </button>
    </Tooltip>
  );
}
