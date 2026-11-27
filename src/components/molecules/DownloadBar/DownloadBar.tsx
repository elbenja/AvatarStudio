import type { SaveState } from '../../../hooks/useDownloads';
import type { Glyph } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';
import './DownloadBar.css';

export interface DownloadBarProps {
  png: SaveState;
  html: SaveState;
  onPng: () => void;
  onHtml: () => void;
  /** Flat: two equal buttons filling a sheet. Otherwise a floating bar. */
  flat?: boolean;
}

// A download reports back in the button itself, so there is no toast to chase.
const WORDS: Partial<Record<SaveState, string>> = { busy: 'Saving', saved: 'Saved', started: 'Started', failed: 'Try again' };
const done = (s: SaveState) => s === 'saved' || s === 'started';
const glyphFor = (s: SaveState, idle?: Glyph): Glyph | undefined => (done(s) ? 'check' : idle);

export function DownloadBar({ png, html, onPng, onHtml, flat }: DownloadBarProps) {
  return (
    <div className={flat ? 'sd-dl sd-dl--flat' : 'sd-dl'} role="group" aria-label="Download this character">
      <Button kind="quiet" glyph={glyphFor(png, 'image')} label={WORDS[png] ?? 'Download PNG'} wide={flat} aria-busy={png === 'busy'} onClick={onPng} />
      <Button kind="soft" glyph={glyphFor(html)} label={WORDS[html] ?? 'Download HTML'} wide={flat} aria-busy={html === 'busy'} onClick={onHtml} />
    </div>
  );
}
