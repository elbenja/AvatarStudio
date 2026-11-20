import { useCallback, useEffect, useRef, useState } from 'react';
import type { Character } from '../avatar/characters';

export type SaveState = 'idle' | 'busy' | 'saved' | 'started' | 'failed';
export type DownloadKind = 'png' | 'html';

/** How long a result ("Started", "Try again") stays in the button before it returns to its label. */
const RESULT_MS = 2200;

async function save(url: string, filename: string): Promise<SaveState> {
  try {
    const res = await fetch(url);
    if (!res.ok) return 'failed';
    const href = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement('a'), { href, download: filename, rel: 'noopener' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
    return 'started';
  } catch {
    return 'failed';
  }
}

/** The PNG and the standalone HTML of the character on stage, each with its own in-button status. */
export function useDownloads(character: Character, onDone?: () => void) {
  const [state, setState] = useState<Record<DownloadKind, SaveState>>({ png: 'idle', html: 'idle' });
  const timers = useRef<Partial<Record<DownloadKind, number>>>({});
  const busy = useRef<Partial<Record<DownloadKind, boolean>>>({});

  useEffect(() => () => Object.values(timers.current).forEach((t) => clearTimeout(t)), []);

  const start = useCallback(
    async (kind: DownloadKind) => {
      if (busy.current[kind]) return;
      busy.current[kind] = true;
      clearTimeout(timers.current[kind]);
      setState((s) => ({ ...s, [kind]: 'busy' }));
      const result = kind === 'png'
        ? await save(character.png, `${character.slug}.png`)
        : await save(character.html, `${character.slug}-avatar.html`);
      busy.current[kind] = false;
      setState((s) => ({ ...s, [kind]: result }));
      onDone?.();
      timers.current[kind] = window.setTimeout(() => setState((s) => ({ ...s, [kind]: 'idle' })), RESULT_MS);
    },
    [character, onDone],
  );

  return { png: state.png, html: state.html, savePng: () => start('png'), saveHtml: () => start('html') };
}
