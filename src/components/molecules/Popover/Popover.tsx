import { useEffect, useId, useRef, type ReactNode } from 'react';
import './Popover.css';

export interface PopoverProps {
  title: string;
  /** An illustration above the title. */
  media?: ReactNode;
  /** Buttons along the bottom; the last one takes focus when it opens. */
  actions: ReactNode;
  /** Escape, or a press anywhere outside the popover and its trigger. */
  onClose: () => void;
  /** The control that opened it: presses on it are left to it, and focus returns to it on Escape. */
  trigger: React.RefObject<HTMLElement | null>;
  children: ReactNode;
}

/** A floating card above the control it explains, pointing at it. Place it inside a relatively positioned wrapper. */
export function Popover({ title, media, actions, onClose, trigger, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const buttons = ref.current?.querySelectorAll<HTMLElement>('.sd-pop-actions > *');
    buttons?.[buttons.length - 1]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
      trigger.current?.focus();
    };
    const onPress = (e: PointerEvent) => {
      const at = e.target as Node;
      if (!ref.current?.contains(at) && !trigger.current?.contains(at)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPress);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPress);
    };
  }, [onClose, trigger]);

  return (
    <div ref={ref} className="sd-pop" role="dialog" aria-labelledby={titleId}>
      {media && <div className="sd-pop-media">{media}</div>}
      <h2 id={titleId} className="sd-pop-title">{title}</h2>
      <div className="sd-pop-text">{children}</div>
      <div className="sd-pop-actions">{actions}</div>
    </div>
  );
}
