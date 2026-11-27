import { useEffect, useRef, useState, type CSSProperties } from 'react';
import FRAMING from 'virtual:avatar/framing';
import { CHARACTERS, characterById } from '../../../avatar/characters';
import { loadAvatar, mountAvatar } from '../../../avatar/mount';
import type { AvatarHandle, CharacterId, Mood } from '../../../avatar/types';
import './Stage.css';

export interface StageProps {
  who: CharacterId;
  mood: Mood;
  moving: boolean;
  speed?: number;
  bounce?: number;
  turn: number;
  paused?: boolean;
  /** False keeps the poster and holds off sculpting, e.g. while the studio waits behind the onboarding card. */
  live?: boolean;
  /** Clear colour of the 3D canvas. */
  background?: string;
  /** A colour glint sweeps across when the character changes. */
  sweep?: boolean;
  /** Head room around the character (1 = tight). */
  pad?: number;
  /** The character turns to face whichever side of the screen the pointer is on, not just lean toward it. */
  wideLean?: boolean;
  onTurn?: (degrees: number) => void;
  /** The character changed emotion by itself (a tap on it returns it to neutral). */
  onMood?: (mood: Mood) => void;
}

interface Applied { mood: Mood; moving: boolean; speed: number; bounce: number; turn: number }
type PerCharacter<T> = Partial<Record<CharacterId, T>>;

/** Sculpting blocks the main thread for a moment: give the loader a frame to paint first. */
const BOOT_DELAY_MS = 120;
const BACKGROUND = '#f6f6f6';

/**
 * The live character. Each character gets its own slot and WebGL canvas, booted the first time it is picked
 * and kept afterwards, so coming back to one is instant. Only the character on stage renders, and only while
 * the stage is on screen and the tab is visible. Until its first frames are drawn, a small dot loader holds
 * its place; if WebGL is missing or the sculpt fails, a still poster stands in for the character.
 */
export function Stage(props: StageProps) {
  const { who, pad = 1.12, live = true, background = BACKGROUND, sweep: sweepOn = true } = props;
  const latest = useRef(props);
  latest.current = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const slots = useRef<PerCharacter<HTMLDivElement | null>>({});
  const handles = useRef<PerCharacter<AvatarHandle>>({});
  const applied = useRef<PerCharacter<Applied>>({});
  const booting = useRef<PerCharacter<boolean>>({});
  const visible = useRef(true);
  const gone = useRef(false);

  const [ready, setReady] = useState<PerCharacter<boolean>>({});
  const [failed, setFailed] = useState<PerCharacter<boolean>>({});
  const [sweep, setSweep] = useState(0);
  const firstWho = useRef(who);

  /** Only the character on stage keeps rendering; the others hold their last frame. */
  const run = () => {
    for (const [id, h] of Object.entries(handles.current) as [CharacterId, AvatarHandle][]) {
      if (id === latest.current.who && latest.current.live !== false && visible.current && !document.hidden) h.resume();
      else h.pause();
    }
  };

  /** Push only what changed into the running character. */
  const apply = (id: CharacterId) => {
    const h = handles.current[id];
    if (!h) return;
    const p = latest.current;
    const was = applied.current[id];
    const now: Applied = { mood: p.mood, moving: p.moving, speed: p.paused ? 0 : p.speed ?? 1, bounce: p.bounce ?? 1, turn: Math.round(p.turn) };
    if (now.mood !== was?.mood) h.setEmotion(now.mood);
    if (now.moving !== was?.moving) h.setMode(now.moving);
    if (now.speed !== was?.speed) h.setSpeed(now.speed);
    if (now.bounce !== was?.bounce) h.setBounce(now.bounce);
    if (now.turn !== was?.turn) h.setTurn(now.turn);
    applied.current[id] = now;
  };

  // Lifetime: pause off screen and in background tabs; free every GL context on unmount.
  useEffect(() => {
    gone.current = false;
    const onVisibility = () => run();
    document.addEventListener('visibilitychange', onVisibility);
    const io = new IntersectionObserver((entries) => {
      visible.current = entries[entries.length - 1].isIntersecting;
      run();
    });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      gone.current = true;
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      Object.values(handles.current).forEach((h) => h.destroy());
      handles.current = {};
      applied.current = {};
      booting.current = {};
    };
    // run reads refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A new character on stage: sweep a glint across, then boot it if it has never been on.
  useEffect(() => {
    run();
    if (who !== firstWho.current && sweepOn) setSweep((n) => n + 1);
    firstWho.current = who;
    if (!live || handles.current[who] || booting.current[who] || failed[who]) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      booting.current[who] = true;
      try {
        const mod = await loadAvatar(who);
        const slot = slots.current[who];
        if (cancelled || gone.current || !slot) { booting.current[who] = false; return; }
        handles.current[who] = mountAvatar(slot, who, mod, {
          background,
          pad,
          wideLean: latest.current.wideLean,
          onReady: () => { if (!gone.current) setReady((r) => ({ ...r, [who]: true })); },
          onTurn: (deg) => { if (latest.current.who === who) latest.current.onTurn?.(deg); },
          onEmotion: (mood) => {
            if (latest.current.who !== who) return;
            applied.current[who] = { ...applied.current[who]!, mood };
            latest.current.onMood?.(mood);
          },
        });
        run();
        apply(who);
      } catch (err) {
        // No WebGL, or the sculpt failed: the poster stays as the character.
        console.warn(`[stage] ${who} could not start`, err);
        setFailed((f) => ({ ...f, [who]: true }));
      } finally {
        booting.current[who] = false;
      }
    }, BOOT_DELAY_MS);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [who, live]);

  // Every render: forward the controls to the character on stage.
  useEffect(() => apply(who));

  const character = characterById(who);
  const isReady = !!ready[who];
  const waiting = live && !isReady && !failed[who];

  return (
    <div ref={rootRef} className="sd-stage" role="img" aria-label={`${character.title}, live 3D character. Drag to turn, tap to hop.`}>
      {sweep > 0 && <div key={sweep} className="sd-glimm" aria-hidden="true" />}

      {/* Only when the 3D cannot start. Sized by the same rule as the camera (see Stage.css). */}
      {failed[who] && (
        <div
          className="sd-poster"
          aria-hidden="true"
          style={{ '--pad': pad, '--fit': FRAMING[who].tall / FRAMING[who].wide } as CSSProperties}
        >
          <img key={who} src={character.poster} alt="" width={800} height={800} decoding="async" />
        </div>
      )}

      {CHARACTERS.map(({ id }) => (
        <div
          key={id}
          ref={(el) => { slots.current[id] = el; }}
          className={'sd-slot' + (id === who && ready[id] ? ' is-live' : '')}
        />
      ))}

      <div className={'sd-loader' + (waiting ? ' is-on' : '')} aria-hidden="true"><i /><i /><i /></div>
    </div>
  );
}
