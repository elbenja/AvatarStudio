import { useRef, type ReactNode } from 'react';
import { OnboardingCard } from '../../organisms/OnboardingCard/OnboardingCard';
import './Onboarding.css';

export interface OnboardingProps {
  /** null once the card has gone; the studio is then shown as is. */
  phase: 'open' | 'leaving' | null;
  onContinue: () => void;
  children: ReactNode;
}

/** First visit: the studio waits behind, blurred and still, under the onboarding card. A click or tap on the
 *  backdrop around the card continues, like the card's own button. */
export function Onboarding({ phase, onContinue, children }: OnboardingProps) {
  const open = phase === 'open';
  // Only a press that starts and ends on the backdrop: a drag that turns the character and is let go outside the
  // card must not close it.
  const pressedBackdrop = useRef(false);
  return (
    <>
      <div className={'sd-onb-behind' + (open ? ' is-blurred' : '')} inert={open}>{children}</div>
      {phase && (
        <>
          <div className={'sd-onb-scrim' + (open ? '' : ' is-gone')} aria-hidden="true" />
          <div
            className="sd-onb-center"
            onPointerDown={(e) => { pressedBackdrop.current = e.target === e.currentTarget; }}
            onClick={(e) => { if (open && pressedBackdrop.current && e.target === e.currentTarget) onContinue(); }}
          >
            <div className={open ? 'sd-card-in' : 'sd-card-out'}>
              <OnboardingCard onContinue={onContinue} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
