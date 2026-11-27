/**
 * avatar-source · a Vite plugin that turns each standalone character page in /html into a mountable module.
 *
 * The HTML files stay the single source of truth: each still opens on its own in a browser, and it is the
 * file people download. At build time this plugin lifts the page's Three.js module out of the HTML and wraps
 * it in `boot(host)`, swapping the few spots where it talks to the window (size, resize, the render loop,
 * the clock) for a host the studio controls. Every swap is checked: if a character file drifts from the
 * shape the studio expects, the build fails and names the anchor that went missing.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/** Character id → its standalone page in /html. */
export const CHARACTER_SOURCES = {
  bear: 'hockey-bear-plush-avatar.html',
  robot: 'baseball-robot-avatar.html',
  cat: 'liberty-cat-avatar.html',
  pig: 'chanchito-avatar-white.html',
} as const;

export type CharacterId = keyof typeof CHARACTER_SOURCES;

const PREFIX = 'virtual:avatar/';
const RESOLVED = '\0' + PREFIX;
/** Where the untouched source page is served, for "Download HTML". */
const SOURCE_DIR = 'characters/source';

interface Rule {
  /** What the swap does, for the error message when its anchor is missing. */
  what: string;
  find: RegExp;
  replace: string;
  optional?: boolean;
}

// Order matters: the frame-clock rule must run before the generic clock rule, and
// document listeners before bare window listeners.
const RULES: Rule[] = [
  {
    what: 'frame clock, scaled by the speed control',
    find: /dt = Math\.min\(rawDt, 0\.1\), t = clock\.elapsedTime/g,
    replace: 'dt = Math.min(rawDt, 0.1) * host.speed, t = (host.t += dt)',
  },
  { what: 'scene time', find: /clock\.elapsedTime/g, replace: 'host.t' },
  {
    what: 'motion smoothing, scaled by the bounce control',
    find: /motion\[key\] \* CALM - smooth\[key\]/g,
    replace: 'motion[key] * CALM * host.bounce - smooth[key]',
  },
  { what: 'body turn toward the pointer', find: /pointerX \* 0\.28 - rig\.rotation\.y/g, replace: 'host.lean(pointerX) - rig.rotation.y' },
  { what: 'viewport width', find: /\binnerWidth\b/g, replace: 'host.w' },
  { what: 'viewport height', find: /\binnerHeight\b/g, replace: 'host.h' },
  { what: 'canvas placement', find: /document\.body\.prepend\(renderer\.domElement\)/g, replace: 'host.attach(renderer.domElement)' },
  { what: 'camera framing', find: /window\.framing\(\)/g, replace: 'host.framing()' },
  { what: 'document listeners', find: /document\.addEventListener\(/g, replace: 'host.onDoc(' },
  { what: 'window listeners', find: /(^|[^.\w])addEventListener\(/gm, replace: '$1host.on(' },
  { what: 'element lookups', find: /document\.getElementById\(/g, replace: 'host.byId(' },
  { what: 'render loop', find: /renderer\.setAnimationLoop\(/g, replace: 'host.loop(renderer, ' },
  { what: 'debug handle', find: /window\.avatar = /g, replace: 'host.avatar = ', optional: true },
  {
    what: 'background colour from the palette',
    find: /(const C = \{[\s\S]*?)\bbg: '#[0-9a-fA-F]{3,8}'/,
    replace: '$1bg: host.bg',
  },
];

/** Globals the wrapped module may still touch once the rules have run. */
const ALLOWED_GLOBALS = /\bdocument\.(createElement|hidden)\b/;

export interface AvatarMeta {
  /** World units the character needs vertically, and the minimum width, from the page's framing script. */
  tall: number;
  wide: number;
  /** The second move: a skate for the hockey bear, a walk for everyone else. */
  mode: 'skate' | 'walk';
}

function fail(name: string, message: string): never {
  throw new Error(`[avatar-source] ${name}: ${message}`);
}

/** The markup of the page's own controls. The module wires listeners to it, so it has to exist (detached). */
function extractUi(html: string, name: string): string {
  const open = /<div id="(ui|spots)"/.exec(html);
  if (!open) fail(name, 'no <div id="ui"> or <div id="spots"> with the emotion buttons');
  let depth = 0;
  const tag = /<\/?div\b/g;
  tag.lastIndex = open.index;
  for (let m = tag.exec(html); m; m = tag.exec(html)) {
    depth += m[0] === '<div' ? 1 : -1;
    if (depth === 0) return html.slice(open.index, html.indexOf('>', m.index) + 1);
  }
  fail(name, `the #${open[1]} block never closes`);
}

/** World units the character needs: TALL vertically, and the minimum width WIDE, from the page's framing script. */
export function readFraming(html: string, name: string): { tall: number; wide: number } {
  const framing = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? fail(name, 'no framing <script>');
  const tallVar = /window\.TALL = ([\d.]+)/.exec(framing)?.[1];
  const fit = /Math\.max\((TALL|[\d.]+) \* h \/ free, ([\d.]+) \* h \/ w\)/.exec(framing);
  if (!fit) fail(name, 'framing script has no "Math.max(TALL * h / free, WIDE * h / w)"');
  const tall = Number(fit[1] === 'TALL' ? tallVar : fit[1]);
  if (!Number.isFinite(tall)) fail(name, 'framing uses TALL but never sets window.TALL');
  return { tall, wide: Number(fit[2]) };
}

function extractMeta(html: string, body: string, name: string): { meta: AvatarMeta; modeFn: string } {
  const modeFn = /function (setSkating|setWalking)\(/.exec(body)?.[1] ?? fail(name, 'no setSkating() or setWalking()');
  return { meta: { ...readFraming(html, name), mode: modeFn === 'setSkating' ? 'skate' : 'walk' }, modeFn };
}

/** Pure transform from a character page to an ES module exporting `meta`, `ui` and `boot(host)`. */
export function transformAvatarSource(html: string, name: string): string {
  const script = /<script type="module">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? fail(name, 'no <script type="module">');
  const imports: string[] = [];
  let body = script.replace(/^import [^;]+;\s*$/gm, (line) => {
    imports.push(line.trim());
    return '';
  });
  if (!imports.some((l) => /from 'three'/.test(l))) fail(name, "the module does not import 'three'");
  if (/\bhost\b/.test(body)) fail(name, 'the module already uses the name "host"');

  for (const rule of RULES) {
    rule.find.lastIndex = 0;
    if (!rule.find.test(body)) {
      if (rule.optional) continue;
      fail(name, `missing anchor for ${rule.what} (${rule.find})`);
    }
    rule.find.lastIndex = 0;
    body = body.replace(rule.find, rule.replace);
  }

  const leftovers = body.match(/\b(window|document)\.\w+/g)?.filter((g) => !ALLOWED_GLOBALS.test(g));
  if (leftovers?.length) fail(name, `unhandled globals after wrapping: ${[...new Set(leftovers)].join(', ')}`);

  const { meta, modeFn } = extractMeta(html, body, name);
  for (const handle of ['renderer', 'scene', 'camera', 'controls', 'buttons', 'setEmotion']) {
    if (!new RegExp(`\\b(const|let|function) ${handle}\\b`).test(body)) fail(name, `no top-level "${handle}" to hand to the studio`);
  }

  return [
    `// Generated from html/${name} by vite/avatar-source.ts. Edit the HTML file, not this.`,
    ...imports,
    `export const meta = ${JSON.stringify(meta)};`,
    `export const ui = ${JSON.stringify(extractUi(html, name))};`,
    'export function boot(host) {',
    body,
    `host.api = { setEmotion, setMode: ${modeFn}, renderer, scene, camera, controls, buttons };`,
    '}',
    '',
  ].join('\n');
}

export function avatarSource(options: { dir: string }): Plugin {
  const fileOf = (id: string) => {
    const file = CHARACTER_SOURCES[id as CharacterId];
    return file ? path.join(options.dir, file) : null;
  };

  return {
    name: 'avatar-source',
    resolveId(id) {
      return id.startsWith(PREFIX) ? '\0' + id : null;
    },
    load(id) {
      if (!id.startsWith(RESOLVED)) return null;
      const name = id.slice(RESOLVED.length);
      // The framing of every character, without their 3D code: the poster needs it before a character loads.
      if (name === 'framing') {
        const framing = Object.fromEntries(Object.keys(CHARACTER_SOURCES).map((key) => {
          const file = fileOf(key)!;
          this.addWatchFile(file);
          const { tall, wide } = readFraming(fs.readFileSync(file, 'utf8'), path.basename(file));
          return [key, { tall, wide }];
        }));
        return `export default ${JSON.stringify(framing)};`;
      }
      const file = fileOf(name) ?? fail(name, `unknown character; known: ${Object.keys(CHARACTER_SOURCES).join(', ')}`);
      this.addWatchFile(file);
      return transformAvatarSource(fs.readFileSync(file, 'utf8'), path.basename(file));
    },
    // "Download HTML" hands out the untouched page: served from /html in dev, copied into the build.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = new RegExp(`^/${SOURCE_DIR}/(\\w+)\\.html$`).exec(req.url?.split('?')[0] ?? '');
        const file = m && fileOf(m[1]);
        if (!file) return next();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        fs.createReadStream(file).pipe(res);
      });
    },
    generateBundle() {
      for (const id of Object.keys(CHARACTER_SOURCES)) {
        this.emitFile({ type: 'asset', fileName: `${SOURCE_DIR}/${id}.html`, source: fs.readFileSync(fileOf(id)!) });
      }
    },
  };
}
