import { useId, useState, type ReactNode } from 'react';
import { CollapseToggle } from '../CollapseToggle/CollapseToggle';
import './Section.css';

export interface SectionProps {
  title: string;
  /** Live detail after the title, e.g. the current emotion. Announced politely when it changes. */
  meta?: string;
  /** Adds a +/− toggle in the corner that folds the body away. Starts open. */
  collapsible?: boolean;
  children: ReactNode;
}

/** A titled block of the sidebar or sheet. Layout only; the content decides the rest. */
export function Section({ title, meta, collapsible, children }: SectionProps) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  return (
    <section className={'sd-sec' + (open ? '' : ' is-collapsed')} aria-label={title}>
      <div className="sd-sec-head">
        <span className="sd-sec-title">
          {title}
          {meta !== undefined && (
            // The key restarts the swap animation each time the value changes.
            <span key={meta} className="sd-sec-meta" aria-live="polite"> · {meta}</span>
          )}
        </span>
        {collapsible && <CollapseToggle open={open} section={title} controls={bodyId} onToggle={setOpen} />}
      </div>
      {collapsible ? (
        <div id={bodyId} className="sd-sec-body" inert={!open}><div>{children}</div></div>
      ) : children}
    </section>
  );
}

/** The inset tray that holds a grid of keys or a pair of buttons. */
export function Well({ children }: { children: ReactNode }) {
  return <div className="sd-well">{children}</div>;
}
