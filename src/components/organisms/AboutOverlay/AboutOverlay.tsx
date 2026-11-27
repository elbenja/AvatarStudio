import { useEffect, useState } from 'react';
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import './AboutOverlay.css';

export interface AboutOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** How long the card takes to leave before it is put away. */
export const CARD_LEAVE_MS = 320;

/**
 * The onboarding card over the live page: whatever it sits on keeps running underneath. After it first opens,
 * the card is put away rather than removed, its stage paused, so its sculpted characters are there next time.
 */
export function AboutOverlay({ open, onClose }: AboutOverlayProps) {
  const [opened, setOpened] = useState(open);
  const [away, setAway] = useState(!open);

  useEffect(() => {
    if (open) { setOpened(true); setAway(false); return; }
    // Leave with the card, then put it away.
    const t = window.setTimeout(() => setAway(true), CARD_LEAVE_MS);
    return () => clearTimeout(t);
  }, [open]);

  if (!opened) return null;
  return (
    <div className={'sd-about' + (open ? '' : ' is-leaving')} hidden={away}>
      <button type="button" className="sd-about-scrim" aria-label="Close About" tabIndex={-1} onClick={onClose} />
      <div className={'sd-about-card ' + (open ? 'sd-card-in' : 'sd-card-out')}>
        <OnboardingCard onContinue={onClose} live={!away} />
      </div>
    </div>
  );
}
