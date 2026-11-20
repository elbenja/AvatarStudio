import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CHARACTER_SOURCES, readFraming, transformAvatarSource } from '../avatar-source';

const HTML_DIR = path.resolve(__dirname, '../../html');

// Guards the wiring: if a character page changes shape, this names the file and the anchor that broke.
describe.each(Object.entries(CHARACTER_SOURCES))('%s (%s)', (_id, file) => {
  const html = fs.readFileSync(path.join(HTML_DIR, file), 'utf8');
  const out = transformAvatarSource(html, file);

  it('exports boot(host), meta and the detached controls', () => {
    expect(out).toMatch(/^export function boot\(host\) \{$/m);
    expect(out).toMatch(/^export const meta = \{"tall":[\d.]+,"wide":[\d.]+,"mode":"(skate|walk)"\};$/m);
    expect(out).toMatch(/^export const ui = "<div id=\\"(ui|spots)\\"/m);
  });

  it('routes size, time, loop and listeners through the host', () => {
    expect(out).not.toMatch(/\binner(Width|Height)\b|clock\.elapsedTime|setAnimationLoop/);
    expect(out).toContain('* host.speed');
    expect(out).toContain('* host.bounce');
    expect(out).toContain('host.loop(renderer, ');
    expect(out).toContain('bg: host.bg');
  });

  it('keeps all eight emotions, in the studio order', () => {
    expect(html.match(/data-emo="[a-z]+"/g)).toHaveLength(8);
  });

  it('reads the framing the poster and camera share', () => {
    const { tall, wide } = readFraming(html, file);
    expect(tall).toBeGreaterThan(3);
    expect(wide).toBeGreaterThan(2);
  });

  it('parses as JavaScript', () => {
    const noImports = out.replace(/^import .*$/gm, '').replace(/^export /gm, '');
    expect(() => new Function(noImports)).not.toThrow();
  });
});
