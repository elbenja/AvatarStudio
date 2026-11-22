import { useEffect, useState } from 'react';
import { OnboardingCard } from '../OnboardingCard/OnboardingCard';
import './AboutOverlay.css';

export interface AboutOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** How long the card takes to leave before its 3D is released. */
export const CARD_LEAVE_MS = 320;

/** The onboarding card over the live page: whatever it sits on keeps running underneath. */
export function AboutOverlay({ open, onClose }: AboutOverlayProps) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) { setMounted(true); return; }
    // Leave with the card, then release its 3D.
    const t = window.setTimeout(() => setMounted(false), CARD_LEAVE_MS);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;
  return (
    <div className={'sd-about' + (open ? '' : ' is-leaving')}>
      <button type="button" className="sd-about-scrim" aria-label="Close About" tabIndex={-1} onClick={onClose} />
      <div className={'sd-about-card ' + (open ? 'sd-card-in' : 'sd-card-out')}>
        <OnboardingCard onContinue={onClose} />
      </div>
    </div>
  );
}
