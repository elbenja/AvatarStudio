// One small face per emotion, drawn on a 40×28 grid. Order matches EMOTIONS.
const blush = (y: number) => (
  <>
    <circle cx="6" cy={y} r="3" fill="var(--sd-blush)" />
    <circle cx="34" cy={y} r="3" fill="var(--sd-blush)" />
  </>
);
const eyes = (y: number, ry = 3.6) => (
  <>
    <ellipse cx="13" cy={y} rx="2.6" ry={ry} fill="currentColor" />
    <ellipse cx="27" cy={y} rx="2.6" ry={ry} fill="currentColor" />
  </>
);
const line = { stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' } as const;

export const FACES = [
  // Happy
  <>{blush(18)}{eyes(11)}<path d="M17 19q3 3 6 0" {...line} /></>,
  // Euphoric
  <>{blush(18)}<path d="M9 12q4-6 8 0M23 12q4-6 8 0" {...line} /><path d="M16 17h8a4 4 0 0 1-8 0z" fill="currentColor" /><path d="M4 3v4M2 5h4" stroke="var(--sd-spark)" strokeWidth="1.4" strokeLinecap="round" /></>,
  // Surprised
  <><path d="M10 3h6M24 3h6" {...line} />{eyes(12)}<circle cx="20" cy="23" r="2" fill="currentColor" /></>,
  // Curious
  <><path d="M10 6h6M24 2l6 2" {...line} /><ellipse cx="13" cy="13" rx="2.6" ry="3.2" fill="currentColor" /><ellipse cx="27" cy="12" rx="2.6" ry="3.6" fill="currentColor" /><path d="M19 22q2.5 1.5 5-1" {...line} /></>,
  // Sleepy
  <><path d="M9 11q4 5 8 0M23 11q4 5 8 0" {...line} /><circle cx="20" cy="22" r="1.6" fill="currentColor" /><path d="M33 2h4l-4 4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  // Sad
  <><path d="M10 6l6-2M24 4l6 2" {...line} />{eyes(13, 3.2)}<path d="M17 23q3-3 6 0" {...line} /></>,
  // Embarrassed
  <>{blush(19)}<path d="M10 7l6 3-6 3M30 7l-6 3 6 3" {...line} strokeLinejoin="round" /><path d="M15 22q2.5-2.5 5 0t5 0" {...line} /></>,
  // Angry
  <><path d="M9 3l7 3M31 3l-7 3" {...line} />{eyes(13, 3.2)}<path d="M17 23q3-2 6 0" {...line} /></>,
];
