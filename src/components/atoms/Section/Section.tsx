import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import './Section.css';

export interface SectionProps {
  title: string;
  /** Live detail after the title, e.g. the current emotion. Announced politely when it changes. */
  meta?: string;
  /** A "+" link in the corner: where to get more of this. */
  add?: { href: string; label: string };
  children: ReactNode;
}

/** A titled block of the sidebar or sheet. Layout only; the content decides the rest. */
export function Section({ title, meta, add, children }: SectionProps) {
  return (
    <section className="sd-sec" aria-label={title}>
      <div className="sd-sec-head">
        <span className="sd-sec-title">
          {title}
          {meta !== undefined && (
            // The key restarts the swap animation each time the value changes.
            <span key={meta} className="sd-sec-meta" aria-live="polite"> · {meta}</span>
          )}
        </span>
        {add && (
          <a className="sd-add" href={add.href} aria-label={add.label} title={add.label}>
            <Icon glyph="plus" />
          </a>
        )}
      </div>
      {children}
    </section>
  );
}

/** The inset tray that holds a grid of keys or a pair of buttons. */
export function Well({ children }: { children: ReactNode }) {
  return <div className="sd-well">{children}</div>;
}
