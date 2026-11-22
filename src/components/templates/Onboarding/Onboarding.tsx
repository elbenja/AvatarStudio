import type { ReactNode } from 'react';
import { OnboardingCard } from '../../organisms/OnboardingCard/OnboardingCard';
import './Onboarding.css';

export interface OnboardingProps {
  /** null once the card has gone; the studio is then shown as is. */
  phase: 'open' | 'leaving' | null;
  onContinue: () => void;
  children: ReactNode;
}

/** First visit: the studio waits behind, blurred and still, under the onboarding card. */
export function Onboarding({ phase, onContinue, children }: OnboardingProps) {
  const open = phase === 'open';
  return (
    <>
      <div className={'sd-onb-behind' + (open ? ' is-blurred' : '')} inert={open}>{children}</div>
      {phase && (
        <>
          <div className={'sd-onb-scrim' + (open ? '' : ' is-gone')} aria-hidden="true" />
          <div className="sd-onb-center">
            <div className={open ? 'sd-card-in' : 'sd-card-out'}>
              <OnboardingCard onContinue={onContinue} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
