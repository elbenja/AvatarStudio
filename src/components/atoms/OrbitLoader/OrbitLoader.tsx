import { useEffect, useRef, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import './OrbitLoader.css';

/** The ring's colours, clockwise from just right of the top. */
const DOTS = [
  '#d4b89c', '#dbbe93', '#e2bc7b', '#e7b966', '#eabc62', '#ecc061', '#eaa959', '#e67e4f', '#e25846',
  '#dd474f', '#d54568', '#cb448b', '#ba46a2', '#915abc', '#6c73d5', '#6785dd', '#788cd1', '#afadd5',
];

/** Resting tilt, and how far the pointer can lean it, in degrees. */
const REST = { x: 50, y: -14 };
const REACH = { x: 24, y: 40 };

export interface OrbitLoaderProps {
  /** Shown and spinning. Off, it fades out and its animations pause. */
  on: boolean;
}

/**
 * A ring of colour dots orbiting in 3D. The spin is CSS on the compositor, so it keeps turning while the main
 * thread is busy sculpting a character. The ring leans toward the pointer, and a tap anywhere gives it an extra turn.
 */
export function OrbitLoader({ on }: OrbitLoaderProps) {
  const calm = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!on || calm || !el) return;
    const lean = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      el.style.setProperty('--rx', `${REST.x - y * REACH.x}deg`);
      el.style.setProperty('--ry', `${REST.y + x * REACH.y}deg`);
    };
    // Two classes take turns so each tap restarts the turn.
    let kick = false;
    const tap = (e: PointerEvent) => {
      lean(e);
      kick = !kick;
      el.classList.toggle('is-kick-a', kick);
      el.classList.toggle('is-kick-b', !kick);
    };
    window.addEventListener('pointermove', lean, { passive: true });
    window.addEventListener('pointerdown', tap, { passive: true });
    return () => {
      window.removeEventListener('pointermove', lean);
      window.removeEventListener('pointerdown', tap);
    };
  }, [on, calm]);

  return (
    <div ref={root} className={'sd-orbit' + (on ? ' is-on' : '')} aria-hidden="true">
      <div className="sd-orbit-tilt">
        <div className="sd-orbit-kick">
          <div className="sd-orbit-spin">
            {DOTS.map((c, i) => (
              <span key={c} className="sd-orbit-dot" style={{ '--a': `${10 + i * 20}deg`, '--c': c } as CSSProperties}>
                <span className="sd-orbit-unkick"><span className="sd-orbit-unspin"><span className="sd-orbit-face" /></span></span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
