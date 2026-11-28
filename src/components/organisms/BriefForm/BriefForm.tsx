import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Brief } from '../../../brief';
import { Button } from '../../atoms/Button/Button';
import { CheckTile } from '../../atoms/CheckTile/CheckTile';
import { Icon } from '../../atoms/Icon/Icon';
import { TextField } from '../../atoms/TextField/TextField';
import './BriefForm.css';

/** Where a character can live. Voice is on the way: shown, not pickable. */
const PLACES = [
  { id: 'website', label: 'Website' },
  { id: 'app', label: 'App' },
  { id: 'social', label: 'Social' },
  { id: 'voice', label: 'Voice AI', soon: true },
] as const;
type PlaceId = (typeof PLACES)[number]['id'];

export type BriefStep = 'character' | 'contact' | 'sent';
const STEPS: readonly BriefStep[] = ['character', 'contact'];

export interface BriefFormProps {
  /** Delivers the finished brief. The receipt shows once it resolves; if it rejects, the form asks to try again. */
  onSend: (brief: Brief) => Promise<void>;
  /** The form moved to another step, e.g. so the page's character can react. */
  onStep?: (step: BriefStep) => void;
  /** Where the link on the last screen goes. */
  studioHref: string;
}

/** The character brief in two short steps, then a receipt. The primary action stays grey until its step is complete. */
export function BriefForm({ onSend, onStep, studioHref }: BriefFormProps) {
  const [step, setStep] = useState<BriefStep>('character');
  const [places, setPlaces] = useState<readonly PlaceId[]>([]);
  const [vision, setVision] = useState('');
  const [assets, setAssets] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [sending, setSending] = useState<'idle' | 'busy' | 'failed'>('idle');
  /** A field people never see. Only a script filling in every input writes here. */
  const [trap, setTrap] = useState('');

  const title = useRef<HTMLHeadingElement>(null);
  const shown = useRef(step);
  // A new step announces itself: focus moves to its title. Not on load, which would steal focus from the page.
  useEffect(() => {
    if (shown.current === step) return;
    shown.current = step;
    title.current?.focus();
  }, [step]);

  const go = (next: BriefStep) => { setStep(next); onStep?.(next); };
  const characterDone = places.length > 0 && vision.trim().length > 0;
  const contactDone = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && brand.trim().length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 'character') { if (characterDone) go('contact'); return; }
    if (!contactDone || sending === 'busy') return;
    // A bot gets its receipt and nothing is sent.
    if (trap) { go('sent'); return; }
    setSending('busy');
    const chosen = PLACES.filter((p) => places.includes(p.id)).map((p) => p.label);
    onSend({ name: name.trim(), email: email.trim(), brand: brand.trim(), places: chosen, vision: vision.trim(), assets: assets.trim() }).then(
      () => { setSending('idle'); go('sent'); },
      () => setSending('failed'),
    );
  };

  if (step === 'sent') {
    return (
      <section className="sd-brief" aria-labelledby="sd-brief-title">
        <div key="sent" className="sd-brief-step sd-brief-sent">
          <span className="sd-brief-done"><Icon glyph="check" /></span>
          <div className="sd-brief-head">
            <h2 id="sd-brief-title" ref={title} tabIndex={-1} className="sd-brief-title">Sketch on the Way</h2>
            <p className="sd-brief-sub">A first sketch of your character lands at {email.trim()} within 48 hours. Free, no strings.</p>
          </div>
          <dl className="sd-brief-recap">
            <div><dt>Lives on</dt><dd>{PLACES.filter((p) => places.includes(p.id)).map((p) => p.label).join(', ')}</dd></div>
            <div><dt>Vision</dt><dd className="sd-brief-clamp">{vision.trim()}</dd></div>
            <div><dt>Brand</dt><dd>{brand.trim()}</dd></div>
          </dl>
          <Button href={studioHref} kind="soft" wide label="Back to the Studio" />
        </div>
      </section>
    );
  }

  const at = STEPS.indexOf(step);
  return (
    <form className="sd-brief" aria-labelledby="sd-brief-title" onSubmit={submit} noValidate>
      <div className="sd-brief-progress">
        <span className="sd-mono">Step {at + 1} of {STEPS.length}</span>
        <span className="sd-brief-bars" aria-hidden="true">
          {STEPS.map((s, i) => <span key={s} className={i <= at ? 'is-on' : undefined} />)}
        </span>
      </div>

      {step === 'character' ? (
        <div key="character" className="sd-brief-step">
          <div className="sd-brief-head">
            <h2 id="sd-brief-title" ref={title} tabIndex={-1} className="sd-brief-title">Your Character</h2>
            <p className="sd-brief-sub">Where it lives, and how it should feel.</p>
          </div>
          <fieldset className="sd-brief-set">
            <legend className="sd-brief-legend">Where will it live?<span>Pick one or more</span></legend>
            <div className="sd-brief-tiles">
              {PLACES.map((p) => (
                <CheckTile
                  key={p.id}
                  label={p.label}
                  on={places.includes(p.id)}
                  disabled={'soon' in p}
                  badge={'soon' in p ? 'Soon' : undefined}
                  onChange={(on) => setPlaces((v) => (on ? [...v, p.id] : v.filter((x) => x !== p.id)))}
                />
              ))}
            </div>
          </fieldset>
          <TextField label="Describe your vision" lines={2} value={vision} onChange={setVision} placeholder="Fluffy, loud, loyal. Wears our orange scarf…" autoComplete="off" />
          <TextField label="Brand assets or references" hint="Optional" type="url" value={assets} onChange={setAssets} placeholder="Link to a folder, Figma or moodboard…" autoComplete="off" />
          <Button type="submit" kind="solid" wide glyphEnd="arrow" label="Continue" disabled={!characterDone} />
        </div>
      ) : (
        <div key="contact" className="sd-brief-step">
          <div className="sd-brief-head">
            <h2 id="sd-brief-title" ref={title} tabIndex={-1} className="sd-brief-title">About You</h2>
            <p className="sd-brief-sub">Where the first sketch should go.</p>
          </div>
          <TextField label="Your name" value={name} onChange={setName} placeholder="Ada Lovelace" autoComplete="name" />
          <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@brand.com" autoComplete="email" />
          <TextField label="Brand or website" value={brand} onChange={setBrand} placeholder="brand.com" autoComplete="organization" />
          <div className="sd-visually-hidden" aria-hidden="true">
            <label>Leave this empty<input type="text" name="fax" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
          </div>
          {sending === 'failed' && <p className="sd-brief-error" role="alert">That did not send. Check your connection and try again.</p>}
          <div className="sd-brief-actions">
            <Button kind="quiet" label="Back" disabled={sending === 'busy'} onClick={() => go('character')} />
            <Button type="submit" kind="solid" glyphEnd="arrow" label={sending === 'busy' ? 'Sending…' : 'Bring it to life'} disabled={!contactDone || sending === 'busy'} />
          </div>
        </div>
      )}
    </form>
  );
}
