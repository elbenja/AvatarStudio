import type { CSSProperties } from 'react';
import { Icon, type Glyph } from '../../atoms/Icon/Icon';
import './TabBar.css';

export interface Tab<T extends string> {
  id: T;
  label: string;
  glyph: Glyph;
}

export interface TabBarProps<T extends string> {
  tabs: readonly Tab<T>[];
  /** The open tab, or null when the sheet is closed. */
  open: T | null;
  /** Where the pill rests while the sheet closes, so it slides away from the tab it left. */
  last: T;
  controls: string;
  onToggle: (id: T) => void;
}

/** Bottom tabs that open and close one shared sheet. A dark pill slides to the open tab. */
export function TabBar<T extends string>({ tabs, open, last, controls, onToggle }: TabBarProps<T>) {
  const index = tabs.findIndex((t) => t.id === (open ?? last));
  return (
    <nav className="sd-tabs" aria-label="Studio panels" style={{ '--n': tabs.length } as CSSProperties}>
      <span className={'sd-tabs-pill' + (open ? ' is-on' : '')} aria-hidden="true" style={{ '--i': index } as CSSProperties} />
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={'sd-tab' + (open === t.id ? ' is-on' : '')}
          aria-expanded={open === t.id}
          aria-controls={controls}
          onClick={() => onToggle(t.id)}
        >
          <Icon glyph={t.glyph} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
