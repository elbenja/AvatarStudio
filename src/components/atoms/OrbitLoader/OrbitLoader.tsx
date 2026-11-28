import { useEffect, useRef, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import './OrbitLoader.css';

/** The ring's colours, clockwise from just right of the top. */
const DOTS = ['#d4b89c', '#e2bc7b', '#eabc62', '#eaa959', '#e25846', '#d54568', '#ba46a2', '#6c73d5', '#788cd1'];

/** Degrees between dots, and where the first one sits clockwise from the top. */
const STEP = 360 / DOTS.length;
const FIRST = STEP / 2;

/** The ring's resting pose and how far the pointer can move it, in degrees: `lean` tips it away from the viewer
 *  (drawn as a squash, cos of the angle), `turn` rotates the ellipse. REST mirrors --k and --tz in the CSS. */
const REST = { lean: 50, turn: -10 };
const REACH = { lean: 24, turn: 24 };

/** The pointer repels the dots like a like magnet: how near it acts and the furthest it pushes, in screen px,
 *  and the burst a tap gives, as a speed in px per frame at the same reach doubled. */
const PUSH = { reach: 64, most: 18, tap: 9 };
/** The spring pulling each dot home: its stiffness, and how much speed survives a frame. */
const SPRING = { pull: 0.14, keep: 0.76 };
/** A tap's extra turns and how long they take to ease out, in ms. */
const KICK = { turns: 1, ms: 1100 };

export interface OrbitLoaderProps {
  /** Shown and spinning. Off, it fades out and its animations pause. */
  on: boolean;
}

/**
 * A ring of colour dots orbiting in a tilted ellipse. The dots only slide, so every browser keeps them round. The
 * spin is CSS on the compositor, so it keeps turning while the main thread is busy sculpting a character. The ring leans toward the pointer, the dots shy away from it on springs,
 * and a tap anywhere scatters them and gives the ring an extra turn.
 */
export function OrbitLoader({ on }: OrbitLoaderProps) {
  const calm = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!on || calm || !el) return;
    const faces = [...el.querySelectorAll<HTMLElement>('.sd-orbit-face')];
    const balls = faces.map((f) => f.firstElementChild as HTMLElement);
    const dots = faces.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const size = balls[0].offsetWidth;
    // The orbit's slides and depth swings. A tap speeds them all up together, then eases them back.
    const spins = el.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation);
    const turn = Number(spins[0]?.effect?.getTiming().duration) || 0;
    let pointer: { x: number; y: number } | null = null;
    let burst = false;
    let kickAt = -1;

    // Each frame: push every dot away from the pointer, then let its spring settle it. The push is measured in
    // screen px and divided by the dot's on-screen scale, so near and far dots move the same visible distance.
    let frame = requestAnimationFrame(function step() {
      frame = requestAnimationFrame(step);
      // The extra speed eases out along (1 - u)², which adds up to KICK.turns over KICK.ms.
      if (kickAt >= 0) {
        const u = (performance.now() - kickAt) / KICK.ms;
        const rate = u < 1 ? 1 + ((3 * KICK.turns * turn) / KICK.ms) * (1 - u) ** 2 : 1;
        spins.forEach((a) => { a.playbackRate = rate; });
        if (u >= 1) kickAt = -1;
      }
      faces.forEach((face, i) => {
        const d = dots[i];
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const r = face.getBoundingClientRect();
          const scale = r.width / size;
          const dx = r.left + r.width / 2 - pointer.x;
          const dy = r.top + r.height / 2 - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const near = Math.max(0, 1 - dist / PUSH.reach);
          tx = ((dx / dist) * PUSH.most * near * near) / scale;
          ty = ((dy / dist) * PUSH.most * near * near) / scale;
          if (burst) {
            const hit = Math.max(0, 1 - dist / (PUSH.reach * 2));
            d.vx += ((dx / dist) * PUSH.tap * hit) / scale;
            d.vy += ((dy / dist) * PUSH.tap * hit) / scale;
          }
        }
        d.vx = (d.vx + (tx - d.x) * SPRING.pull) * SPRING.keep;
        d.vy = (d.vy + (ty - d.y) * SPRING.pull) * SPRING.keep;
        // At rest with no pointer: nothing to write.
        if (!pointer && Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.vx) + Math.abs(d.vy) < 0.02) {
          if (d.x || d.y) balls[i].style.translate = '';
          d.x = d.y = d.vx = d.vy = 0;
          return;
        }
        d.x += d.vx;
        d.y += d.vy;
        balls[i].style.translate = `${d.x}px ${d.y}px`;
      });
      burst = false;
    });

    const lean = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      el.style.setProperty('--k', `${Math.cos(((REST.lean - y * REACH.lean) * Math.PI) / 180)}`);
      el.style.setProperty('--tz', `${REST.turn + x * REACH.turn}deg`);
    };
    const tap = (e: PointerEvent) => {
      lean(e);
      burst = true;
      kickAt = performance.now();
    };
    // A finger lifts and a mouse leaves the window: the dots spring home.
    const lift = (e: PointerEvent) => { if (e.pointerType !== 'mouse') pointer = null; };
    const leave = (e: PointerEvent) => { if (!e.relatedTarget) pointer = null; };
    window.addEventListener('pointermove', lean, { passive: true });
    window.addEventListener('pointerdown', tap, { passive: true });
    window.addEventListener('pointerup', lift, { passive: true });
    window.addEventListener('pointercancel', lift, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      spins.forEach((a) => { a.playbackRate = 1; });
      balls.forEach((b) => { b.style.translate = ''; });
      window.removeEventListener('pointermove', lean);
      window.removeEventListener('pointerdown', tap);
      window.removeEventListener('pointerup', lift);
      window.removeEventListener('pointercancel', lift);
      window.removeEventListener('pointerout', leave);
    };
  }, [on, calm]);

  return (
    <div ref={root} className={'sd-orbit' + (on ? ' is-on' : '')} aria-hidden="true">
      <div className="sd-orbit-tilt">
        {DOTS.map((c, i) => (
          <span key={c} className="sd-orbit-x" style={{ '--at': (FIRST + i * STEP) / 360, '--c': c } as CSSProperties}>
            <span className="sd-orbit-y">
              <span className="sd-orbit-dot"><span className="sd-orbit-face"><span className="sd-orbit-ball" /></span></span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
