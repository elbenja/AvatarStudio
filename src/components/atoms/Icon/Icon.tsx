import './Icon.css';

// 24×24 stroke glyphs. Stroke colour follows `currentColor`, so an icon takes its parent's ink.
const GLYPHS = {
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8" /><path d="M9 10h.01M15 10h.01" strokeWidth="2.2" /></>,
  turn: <path d="M6 4v10a4 4 0 0 0 4 4h10M6 4 3 7M6 4l3 3M20 18l-3-3M20 18l-3 3" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  curve: <><path d="M4 19.5C10 19.5 10 5 20 4.5" /><path d="M7 6h5" /><circle cx="5.5" cy="6" r="1.5" /></>,
  about: <><path d="M12 20H10C6.229 20 4.343 20 3.172 18.828 2 17.657 2 15.771 2 12V11C2 7.229 2 5.343 3.172 4.172 4.343 3 6.229 3 10 3H14C17.771 3 19.657 3 20.828 4.172 22 5.343 22 7.229 22 11V12" /><path d="M6.25 7.25h.01M10.25 7.25h.01" strokeWidth="2" /><path d="M19 16.125V18M19 18V19.875M19 18H17.5M19 18H20.5M22 18L20.699 17.566C20.102 17.367 19.633 16.899 19.434 16.301L19 15L18.566 16.301C18.367 16.899 17.899 17.367 17.301 17.566L16 18L17.301 18.434C17.899 18.633 18.367 19.102 18.566 19.699L19 21L19.434 19.699C19.633 19.102 20.102 18.633 20.699 18.434L22 18Z" /></>,
  image: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="9" cy="9" r="1.5" /><path d="m4 16 4-4 4 4 3-3 5 5" /></>,
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  idle: <><circle cx="12" cy="5" r="2" /><path d="M12 8v7M9 21l3-6 3 6M9 11h6" /></>,
  walk: <><circle cx="13" cy="4.5" r="2" /><path d="m13 8-3 4 3 3v5M10 12l-2 2.5M13 8l3 3 2.5 1M10.5 20.5 12 17" /></>,
  person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  bag: <><path d="M8 7h8c1.886 0 2.828 0 3.414.586C20 8.172 20 9.114 20 11v4c0 3.3 0 4.95-1.025 5.975C17.95 22 16.3 22 13 22h-2c-3.3 0-4.95 0-5.975-1.025C4 19.95 4 18.3 4 15v-4c0-1.886 0-2.828.586-3.414C5.172 7 6.114 7 8 7Z" /><path d="M16 9.5C16 5.634 14.209 2 12 2S8 5.634 8 9.5" /></>,
} as const;

export type Glyph = keyof typeof GLYPHS;

export interface IconProps {
  glyph: Glyph;
  /** Trailing icon: nudges toward the reading direction on hover inside a Button. */
  end?: boolean;
  className?: string;
}

/** Decorative by design: the control that holds it carries the accessible name. */
export function Icon({ glyph, end, className }: IconProps) {
  const cls = ['sd-ico', end && 'sd-ico--end', className].filter(Boolean).join(' ');
  return (
    <span className={cls} aria-hidden="true">
      <svg viewBox="0 0 24 24">{GLYPHS[glyph]}</svg>
    </span>
  );
}
