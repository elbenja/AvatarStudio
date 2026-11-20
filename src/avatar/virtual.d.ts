// Modules generated from /html by vite/avatar-source.ts. Ambient, so the types are spelled out here;
// AvatarModule in ./types.ts is the shape the studio relies on.
declare module 'virtual:avatar/framing' {
  /** Each character's framing, read from its page at build time. Tiny, so it ships with the app. */
  const framing: Record<'bear' | 'robot' | 'cat' | 'pig', { tall: number; wide: number }>;
  export default framing;
}

declare module 'virtual:avatar/*' {
  export const meta: { tall: number; wide: number; mode: 'skate' | 'walk' };
  export const ui: string;
  export function boot(host: unknown): void;
}
