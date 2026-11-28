import type * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type CharacterId = 'bear' | 'robot' | 'cat' | 'pig';

/** -1 is neutral; 0–7 index into EMOTIONS. */
export type Mood = number;

/** What a character module hands back once it has booted. */
export interface AvatarApi {
  setEmotion(name: string | null): void;
  setMode(moving: boolean): void;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  buttons: HTMLButtonElement[];
}

/**
 * The contract between a character module and the studio. The plugin in vite/avatar-source.ts rewrites
 * each page's window access into calls on this object.
 */
export interface AvatarHost {
  readonly w: number;
  readonly h: number;
  bg: string;
  /** Scene time in seconds. Advances by the frame delta times `speed`, so a slower character is slower everywhere. */
  t: number;
  speed: number;
  bounce: number;
  api: AvatarApi | null;
  avatar?: unknown;
  on(type: string, fn: EventListener, options?: AddEventListenerOptions): void;
  onDoc(type: string, fn: EventListener, options?: AddEventListenerOptions): void;
  attach(canvas: HTMLCanvasElement): void;
  byId(id: string): HTMLElement | null;
  framing(): { V: number; panel: number };
  /** How far the body turns (radians) for a pointer at x, from -1 (left edge) to 1 (right edge). */
  lean(x: number): number;
  loop(renderer: THREE.WebGLRenderer, frame: XRFrameRequestCallback): void;
}

export interface AvatarMeta {
  tall: number;
  wide: number;
  mode: 'skate' | 'walk';
}

export interface AvatarModule {
  meta: AvatarMeta;
  ui: string;
  boot(host: AvatarHost): void;
}

export interface MountOptions {
  background?: string;
  /** Head room around the character: 1 fits it exactly, larger values leave more air. */
  pad?: number;
  /**
   * How the character answers the pointer. 'lean' (the default) turns a little toward it; 'face' turns far enough,
   * measured from the camera, to face whichever side of the screen it is on; 'ignore' never watches it.
   */
  pointer?: 'lean' | 'face' | 'ignore';
  /** The first frames are on screen. */
  onReady?: () => void;
  /** The camera was turned, in whole degrees. */
  onTurn?: (degrees: number) => void;
  /** The character changed emotion on its own, e.g. a tap on it returns it to neutral. */
  onEmotion?: (mood: Mood) => void;
}

export interface AvatarHandle {
  readonly id: CharacterId;
  setEmotion(mood: Mood): void;
  setMode(moving: boolean): void;
  setSpeed(speed: number): void;
  setBounce(bounce: number): void;
  getTurn(): number;
  setTurn(degrees: number): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}
