import { Spherical, Vector3 } from 'three';
import type { AvatarHandle, AvatarHost, AvatarModule, CharacterId, Mood, MountOptions } from './types';

/**
 * Each character is its own chunk: the studio only downloads and sculpts the one on stage.
 * The modules are generated from /html by vite/avatar-source.ts.
 */
const loaders: Record<CharacterId, () => Promise<AvatarModule>> = {
  bear: () => import('virtual:avatar/bear'),
  robot: () => import('virtual:avatar/robot'),
  cat: () => import('virtual:avatar/cat'),
  pig: () => import('virtual:avatar/pig'),
};

/** The pages' own body turn toward the pointer at either edge, in radians. */
const LEAN = 0.28;

export function loadAvatar(id: CharacterId): Promise<AvatarModule> {
  return loaders[id]();
}

/** Boots a character into `el`, sized to it. Sculpting blocks the main thread for a moment. */
export function mountAvatar(el: HTMLElement, id: CharacterId, mod: AvatarModule, opts: MountOptions = {}): AvatarHandle {
  // The page's own controls, kept detached: the module wires its listeners to them, and their
  // aria-pressed tells us when the character changes emotion by itself.
  const ui = document.createElement('div');
  ui.innerHTML = mod.ui;

  const listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions | undefined]> = [];
  const resizers: Array<() => void> = [];
  let renderer: Parameters<AvatarHost['loop']>[0] | null = null;
  let frame: XRFrameRequestCallback | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let paused = false;
  let ready = false;
  let destroyed = false;

  const host: AvatarHost = {
    get w() { return Math.max(2, el.clientWidth); },
    get h() { return Math.max(2, el.clientHeight); },
    bg: opts.background ?? '#f6f6f6',
    t: 0,
    speed: 1,
    bounce: 1,
    api: null,
    on(type, fn, o) {
      if (type === 'resize') { resizers.push(fn as () => void); return; }
      // The pages read the pointer as clientX / width, written for a full-window canvas. Here the canvas is one
      // box on the page, so hand them coordinates inside that box, clamped to its edges: the character turns
      // toward the pointer wherever it is, and never past its full turn.
      if (type === 'pointermove') {
        const inner = fn;
        fn = ((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const clientX = Math.min(Math.max(e.clientX - r.left, 0), r.width);
          const clientY = Math.min(Math.max(e.clientY - r.top, 0), r.height);
          inner({ pointerType: e.pointerType, clientX, clientY } as unknown as Event);
        }) as EventListener;
      }
      window.addEventListener(type, fn, o);
      listeners.push([window, type, fn, o]);
    },
    onDoc(type, fn, o) {
      document.addEventListener(type, fn, o);
      listeners.push([document, type, fn, o]);
    },
    attach(c) {
      canvas = c;
      c.style.display = 'block';
      c.style.outline = 'none';
      el.appendChild(c);
    },
    byId(elementId) {
      // The page fades its poster out after three frames: that is our "ready".
      if (elementId === 'poster') {
        if (!ready) { ready = true; opts.onReady?.(); }
        return null;
      }
      return ui.querySelector<HTMLElement>('#' + elementId);
    },
    framing() {
      const pad = opts.pad ?? 1.06;
      return { V: Math.max(mod.meta.tall * pad, (mod.meta.wide * host.h) / host.w), panel: 0 };
    },
    lean(x) {
      if (!opts.wideLean || !host.api) return x * LEAN;
      // With the camera off to one side, the pages' small turn only reaches one side of the screen.
      // Reach past the camera's angle on the far side, so left and right mirror each other on screen.
      const az = Math.min(Math.max(host.api.controls.getAzimuthalAngle(), -Math.PI / 2), Math.PI / 2);
      return x * (LEAN + Math.max(0, x < 0 ? -2 * az : 2 * az));
    },
    loop(r, fn) {
      renderer = r;
      frame = fn;
      if (!paused) r.setAnimationLoop(fn);
    },
  };

  mod.boot(host);
  const api = host.api;
  if (!api) throw new Error(`[avatar] ${id} booted without handing back its api`);

  const emotionKeys = api.buttons.map((b) => b.dataset.emo ?? '');
  let mood: Mood = -1;
  const moodObserver = new MutationObserver(() => {
    const now = api.buttons.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
    if (now !== mood) { mood = now; opts.onEmotion?.(now); }
  });
  moodObserver.observe(ui, { subtree: true, attributeFilter: ['aria-pressed'] });

  const resize = new ResizeObserver(() => { if (!destroyed) resizers.forEach((fn) => fn()); });
  resize.observe(el);

  const getTurn = () => Math.round((api.controls.getAzimuthalAngle() * 180) / Math.PI);
  let lastTurn: number | null = null;
  api.controls.addEventListener('change', () => {
    const deg = getTurn();
    if (deg !== lastTurn) { lastTurn = deg; opts.onTurn?.(deg); }
  });

  const sph = new Spherical();
  const offset = new Vector3();

  return {
    id,
    setEmotion(next) {
      mood = next;
      api.setEmotion(next < 0 ? null : emotionKeys[next] ?? null);
    },
    setMode(moving) { api.setMode(moving); },
    setSpeed(speed) { host.speed = speed; },
    setBounce(bounce) { host.bounce = bounce; },
    getTurn,
    setTurn(deg) {
      if (deg === getTurn()) return;
      offset.copy(api.camera.position).sub(api.controls.target);
      sph.setFromVector3(offset);
      sph.theta = (deg * Math.PI) / 180;
      api.camera.position.copy(api.controls.target).add(offset.setFromSpherical(sph));
      lastTurn = deg;
      api.controls.update();
    },
    pause() {
      paused = true;
      renderer?.setAnimationLoop(null);
    },
    resume() {
      paused = false;
      if (renderer && frame) renderer.setAnimationLoop(frame);
    },
    destroy() {
      destroyed = true;
      moodObserver.disconnect();
      resize.disconnect();
      api.controls.dispose();
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        renderer.forceContextLoss();
      }
      listeners.forEach(([target, type, fn, o]) => target.removeEventListener(type, fn, o));
      canvas?.remove();
    },
  };
}
