import { Slider } from '../../atoms/Slider/Slider';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { BOUNCE, SPEED, TURN } from '../../../state/studio';
import './MotionPanel.css';

export interface MotionPanelProps {
  speed: number;
  bounce: number;
  turn: number;
  onSpeed: (v: number) => void;
  onBounce: (v: number) => void;
  onTurn: (v: number) => void;
  /** Shows a header with a close button. Leave off to embed the sliders in a sheet. */
  onClose?: () => void;
  id?: string;
}

export function MotionPanel({ speed, bounce, turn, onSpeed, onBounce, onTurn, onClose, id }: MotionPanelProps) {
  const framed = !!onClose;
  return (
    <div id={id} className={framed ? 'sd-panel' : 'sd-panel sd-panel--bare'} role="group" aria-label="Motion settings">
      {framed && (
        <div className="sd-panel-head">
          <span className="sd-panel-title">Motion</span>
          <IconButton glyph="close" label="Close Motion" small onClick={onClose} />
        </div>
      )}
      <Slider label="Speed" unit="times" value={speed} {...SPEED} onChange={onSpeed} />
      <Slider label="Bounce" unit="plain" value={bounce} {...BOUNCE} onChange={onBounce} />
      <Slider label="Turn" unit="degrees" value={turn} min={TURN.min} max={TURN.max} step={TURN.step} onChange={onTurn} />
    </div>
  );
}
