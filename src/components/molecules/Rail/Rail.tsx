import { IconButton } from '../../atoms/IconButton/IconButton';
import './Rail.css';

interface StageTools {
  compact?: false;
  paused: boolean;
  motionOpen: boolean;
  onNextEmotion: () => void;
  onResetView: () => void;
  onTogglePause: () => void;
  onToggleMotion: () => void;
}

/** Compact: About only, for phones, where the stage tools live in the sheet. */
interface AboutOnly { compact: true }

export type RailProps = (StageTools | AboutOnly) & { onAbout: () => void };

/** Vertical toolbar of stage tools, ending with About. */
export function Rail(props: RailProps) {
  return (
    <div className={'sd-rail' + (props.compact ? ' sd-rail--compact' : '')} role="toolbar" aria-label="Stage tools" aria-orientation="vertical">
      {!props.compact && (
        <>
          <IconButton tipSide="right" glyph="smile" label="Next emotion" onClick={props.onNextEmotion} />
          <IconButton tipSide="right" glyph="turn" label="Reset view" onClick={props.onResetView} />
          <IconButton tipSide="right" glyph={props.paused ? 'play' : 'pause'} label={props.paused ? 'Play' : 'Pause'} toggle on={props.paused} onClick={props.onTogglePause} />
          <IconButton tipSide="right" glyph="curve" className="sd-rail-motion" label="Motion" toggle on={props.motionOpen} aria-controls="sd-motion-panel" aria-expanded={props.motionOpen} onClick={props.onToggleMotion} />
          <div className="sd-rail-rule" role="separator" />
        </>
      )}
      <IconButton tipSide="right" glyph="about" label="About" onClick={props.onAbout} />
    </div>
  );
}
