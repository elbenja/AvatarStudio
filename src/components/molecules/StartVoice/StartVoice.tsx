import { useCallback, useId, useRef, useState } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Popover } from '../Popover/Popover';
import './StartVoice.css';

const TALKING = `${import.meta.env.BASE_URL}characters/glace-talk.webp`;

/** Voice chat isn't built yet: the button opens a popover that says what it will be. */
export function StartVoice() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const popId = useId();
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="sd-voice">
      {open && (
        <div id={popId}>
          <Popover
            title="Voice Chat"
            trigger={trigger}
            onClose={close}
            media={<img src={TALKING} alt="" width={800} height={500} />}
            actions={<Button kind="soft" label="Got it" onClick={close} />}
          >
            Talk to your character. It listens, reacts, and talks back. Coming soon.
          </Popover>
        </div>
      )}
      <Button
        ref={trigger}
        kind="go"
        size="lg"
        glyph="mic"
        label="Start Voice"
        badge="Soon"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={() => setOpen((o) => !o)}
      />
    </div>
  );
}
