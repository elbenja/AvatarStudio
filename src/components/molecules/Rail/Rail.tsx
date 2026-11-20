import { IconButton } from '../../atoms/IconButton/IconButton';
import './Rail.css';

export interface RailProps {
  paused: boolean;
  motionOpen: boolean;
  onNextEmotion: () => void;
  onResetView: () => void;
  onTogglePause: () => void;
  onToggleMotion: () => void;
  /** The About button shows only when there is somewhere for it to go. */
  onAbout?: () => void;
}

/** Vertical toolbar of stage tools. */
export function Rail({ paused, motionOpen, onNextEmotion, onResetView, onTogglePause, onToggleMotion, onAbout }: RailProps) {
  return (
    <div className="sd-rail" role="toolbar" aria-label="Stage tools" aria-orientation="vertical">
      <IconButton glyph="smile" label="Next emotion" onClick={onNextEmotion} />
      <IconButton glyph="turn" label="Reset view" onClick={onResetView} />
      <IconButton glyph={paused ? 'play' : 'pause'} label={paused ? 'Play' : 'Pause'} toggle on={paused} onClick={onTogglePause} />
      <IconButton glyph="curve" label="Motion" toggle on={motionOpen} aria-controls="sd-motion-panel" aria-expanded={motionOpen} onClick={onToggleMotion} />
      {onAbout && (
        <>
          <div className="sd-rail-rule" role="separator" />
          <IconButton glyph="about" label="About this project" onClick={onAbout} />
        </>
      )}
    </div>
  );
}
