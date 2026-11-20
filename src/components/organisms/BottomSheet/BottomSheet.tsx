import { useRef, type PointerEvent, type ReactNode } from 'react';
import './BottomSheet.css';

export interface BottomSheetProps {
  id: string;
  open: boolean;
  label: string;
  /** Changes when the content swaps, to replay the swap-in. */
  contentKey: string;
  onClose: () => void;
  children: ReactNode;
}

/** Past this many pixels a drag on the handle closes the sheet; a shorter one springs back. */
const DISMISS_PX = 56;

/**
 * A sheet that rises above the tab bar. Drag its handle down, or tap it, to close. While dragging, the sheet
 * follows the finger through a CSS variable, so React does not re-render on every pointer move.
 */
export function BottomSheet({ id, open, label, contentKey, onClose, children }: BottomSheetProps) {
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const dragged = useRef(false);

  const setDrag = (px: number, dragging: boolean) => {
    sheet.current?.style.setProperty('--drag', `${px}px`);
    sheet.current?.classList.toggle('is-dragging', dragging);
  };

  const down = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(0, true);
  };
  const move = (e: PointerEvent) => {
    if (!drag.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    setDrag(drag.current.dy, true);
  };
  const up = () => {
    if (!drag.current) return;
    const { dy } = drag.current;
    drag.current = null;
    dragged.current = dy > 4;
    setDrag(0, false);
    if (dy > DISMISS_PX) onClose();
  };

  return (
    <div id={id} ref={sheet} className={'sd-sheet' + (open ? ' is-open' : '')} role="region" aria-label={label} inert={!open}>
      <button
        type="button"
        className="sd-sheet-grab"
        aria-label="Close panel"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClick={() => { if (dragged.current) { dragged.current = false; return; } onClose(); }}
      />
      <div key={contentKey} className="sd-sheet-body">{children}</div>
    </div>
  );
}
