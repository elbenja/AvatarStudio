import { useState } from 'react';
import type { Brief } from '../../../brief';
import { Button } from '../../atoms/Button/Button';
import { Logo } from '../../molecules/Logo/Logo';
import { BriefForm, type BriefStep } from '../../organisms/BriefForm/BriefForm';
import { Pitch, PitchIncludes } from '../../organisms/Pitch/Pitch';
import './GetYours.css';

export interface GetYoursProps {
  /** Delivers a finished brief; see BriefForm. */
  onSend: (brief: Brief) => Promise<void>;
  /** Where "Back" and the receipt's link go. */
  studioHref: string;
}

/** The commission page: the brief on one side, the pitch and a live character on the other. On a phone the brief sits between the pitch and what is included. */
export function GetYours({ onSend, studioHref }: GetYoursProps) {
  const [step, setStep] = useState<BriefStep>('character');
  return (
    <div className="sd-gy">
      <header className="sd-gy-top sd-in">
        <Logo />
        <Button href={studioHref} kind="float" label="Back" />
      </header>
      <main className="sd-gy-main">
        <div className="sd-gy-form sd-in sd-in-1"><BriefForm onSend={onSend} studioHref={studioHref} onStep={setStep} /></div>
        <div className="sd-gy-side">
          <div className="sd-gy-pitch sd-in sd-in-2"><Pitch sent={step === 'sent'} /></div>
          <div className="sd-gy-includes sd-in sd-in-3"><PitchIncludes /></div>
        </div>
      </main>
    </div>
  );
}
