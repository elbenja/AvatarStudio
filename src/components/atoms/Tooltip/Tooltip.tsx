import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Names the action. Repeat nothing else. */
  label: string;
  /** Shortcut hint, e.g. "⌘Z". */
  kbd?: string;
  side?: TooltipSide;
  delay?: number;
  /** One element: the control the tooltip describes. */
  children: ReactNode;
}

const GAP = 8;

/** Near-black hover label with an optional shortcut hint. Mouse hover after a short delay, or keyboard focus. */
export function Tooltip({ label, kbd, side = 'bottom', delay = 260, children }: TooltipProps) {
  const host = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const show = () => {
    const el = host.current?.firstElementChild;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = side === 'right' ? r.right + GAP : side === 'left' ? r.left - GAP : r.left + r.width / 2;
    const y = side === 'bottom' ? r.bottom + GAP : side === 'top' ? r.top - GAP : r.top + r.height / 2;
    setPos({ x, y });
  };
  const hide = () => { window.clearTimeout(timer.current); setPos(null); };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={host}
      className="sd-tip"
      // Touch taps would leave a stray label behind, so only a real mouse hovers.
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') timer.current = window.setTimeout(show, delay); }}
      onPointerLeave={hide}
      onPointerDown={hide}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) show(); }}
      onBlur={hide}
    >
      {children}
      {pos && createPortal(
        <span className="sd-tip-bubble" data-side={side} role="tooltip" style={{ left: pos.x, top: pos.y }}>
          {label}
          {kbd && <span className="sd-tip-kbd">{kbd}</span>}
        </span>,
        document.body,
      )}
    </span>
  );
}
