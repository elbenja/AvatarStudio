import { useState } from 'react';
import { EMOTIONS } from '../../../avatar/characters';
import type { CharacterId, Mood } from '../../../avatar/types';
import { TURN } from '../../../state/studio';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';
import { Tag } from '../../atoms/Tag/Tag';
import { SwatchRow } from '../../molecules/SwatchRow/SwatchRow';
import { Stage } from '../Stage/Stage';
import './Pitch.css';

const INCLUDED = [
  'Custom design, sculpted in code',
  '8 emotions and 2 moves',
  'HTML embed and transparent PNGs',
  '2 rounds on the character image, 2 on the 3D',
  'About 1 week',
] as const;

/** Head room around the character: 1 fills the stage, so 1 / 0.9 shows it at 90%. Chanchito is rounder and reads bigger, so he gets a little more. */
const PAD = 1 / 0.9;
const PAD_FOR: Partial<Record<CharacterId, number>> = { pig: 1 / 0.84 };

const mood = (name: (typeof EMOTIONS)[number]): Mood => EMOTIONS.indexOf(name);

export interface PitchProps {
  /** The brief was sent: the character celebrates. */
  sent?: boolean;
}

/**
 * Why you would want one: a live character, curious, walking toward the brief. It is far bigger than its column and
 * dissolves into a blurred hem, with the offer in two lines over its feet. It does not watch the pointer.
 */
export function Pitch({ sent = false }: PitchProps) {
  const calm = usePrefersReducedMotion();
  const [who, setWho] = useState<CharacterId>('cat');
  return (
    <div className="sd-pitch sd-pitch--hero">
      <div className="sd-pitch-stage">
        <Stage who={who} mood={mood(sent ? 'Euphoric' : 'Curious')} moving={!calm} bounce={calm ? 0.4 : 1} turn={TURN.home} pad={PAD_FOR[who] ?? PAD} sweep={false} pointer="ignore" />
      </div>
      <div className="sd-pitch-hem" aria-hidden="true" />
      <div className="sd-pitch-tags" aria-hidden="true">
        <span className="sd-pitch-tag-1"><Tag tone="canvas" label="threejs" /></span>
        <span className="sd-pitch-tag-2"><Tag tone="canvas" label="Custom avatar" delay={1.4} /></span>
        <span className="sd-pitch-tag-3"><Tag tone="canvas" label="slop killer" delay={2.8} /></span>
      </div>
      <div className="sd-pitch-body">
        <SwatchRow who={who} onPick={setWho} />
        <h1 className="sd-pitch-title">Your mascot is waiting to be born.</h1>
        <p className="sd-pitch-text">Tell me about your brand and I'll send back a first sketch of your character within 48 hours. Free, no strings.</p>
      </div>
    </div>
  );
}

/** What the commission includes, and what it costs. */
export function PitchIncludes() {
  return (
    <div className="sd-pitch">
      <ul className="sd-pitch-list">
        {INCLUDED.map((line) => <li key={line}><Icon glyph="check" />{line}</li>)}
      </ul>
      <p className="sd-pitch-price">
        <Badge label="Founding offer" />
        <span><span className="sd-mono">$900</span> for the first 5 brands, then <span className="sd-mono">$1,200</span></span>
      </p>
    </div>
  );
}
