import { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '../../../avatar/characters';
import type { CharacterId } from '../../../avatar/types';
import { TURN } from '../../../state/studio';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { Button } from '../../atoms/Button/Button';
import { Tag } from '../../atoms/Tag/Tag';
import { SwatchRow } from '../../molecules/SwatchRow/SwatchRow';
import { Stage } from '../Stage/Stage';
import './OnboardingCard.css';

export interface OnboardingCardProps {
  onContinue: () => void;
  /** Seconds each character stays on before the next one walks on. */
  interval?: number;
  /** False pauses the stage and the parade, e.g. while the card is put away. */
  live?: boolean;
}

/** Matches --sd-card-stage: the 3D canvas needs the colour itself, not the variable. */
const STAGE_BG = '#eff2f6';

/** "Avatar Studio" in a card: the characters parade through a live stage until someone picks one. */
export function OnboardingCard({ onContinue, interval = 3, live = true }: OnboardingCardProps) {
  const calm = usePrefersReducedMotion();
  const [who, setWho] = useState<CharacterId>(CHARACTERS[0].id);
  const [picked, setPicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const close = useRef<HTMLButtonElement>(null);

  // Focus lands on Close whenever the card comes up, including when it is brought back after being put away.
  useEffect(() => { if (live) close.current?.focus(); }, [live]);

  // The parade stops once someone picks a character, while the pointer rests on the card, and under reduced motion.
  useEffect(() => {
    if (!live || picked || hovering || calm) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setWho((w) => CHARACTERS[(CHARACTERS.findIndex((c) => c.id === w) + 1) % CHARACTERS.length].id);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [live, picked, hovering, calm, interval]);

  return (
    <section
      className="sd-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sd-card-title"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') onContinue(); }}
    >
      <div className="sd-card-top">
        <SwatchRow who={who} onPick={(id) => { setWho(id); setPicked(true); }} />
      </div>

      <div className="sd-card-hero">
        <div className="sd-card-stage">
          <Stage who={who} mood={-1} moving turn={TURN.home} live={live} warm pad={0.98} background={STAGE_BG} sweep={false} pointer="face" />
        </div>
        <div className="sd-card-hem" aria-hidden="true" />
        <div className="sd-card-tags" aria-hidden="true">
          <span className="sd-card-tag-1"><Tag label="threejs" /></span>
          <span className="sd-card-tag-2"><Tag label={who} delay={1.4} /></span>
          <span className="sd-card-tag-3"><Tag label="slop killer" delay={2.8} /></span>
        </div>
      </div>

      <div className="sd-card-body">
        <h2 id="sd-card-title" className="sd-card-title">Avatar Studio</h2>
        <p className="sd-card-text">A Silverdesk lab experiment that got out of hand, and now it kills slop for a living. Your company could have one too: a custom avatar that dances, pouts, and chats back.</p>
      </div>

      <div className="sd-card-foot">
        <Button ref={close} kind="float" label="Close" onClick={onContinue} />
      </div>
    </section>
  );
}
