import { Button } from '../../atoms/Button/Button';
import { Section, Well } from '../../atoms/Section/Section';
import './MotionSwitch.css';

export interface MotionSwitchProps {
  moving: boolean;
  /** "Skate" for the hockey bear, "Walk" for the rest. */
  moveLabel: string;
  onChange: (moving: boolean) => void;
  /** Side by side on a phone sheet; stacked in the sidebar. */
  row?: boolean;
}

/** Two toggles that act as one choice: standing still, or the character's move. */
export function MotionSwitch({ moving, moveLabel, onChange, row }: MotionSwitchProps) {
  return (
    <Section title="Motion" collapsible>
      <Well>
        <div className={row ? 'sd-moves sd-moves--row' : 'sd-moves'} role="group" aria-label="Movement">
          <Button kind={moving ? 'soft' : 'solid'} glyph="idle" label="Idle" wide pressed={!moving} onClick={() => onChange(false)} />
          <Button kind={moving ? 'solid' : 'soft'} glyph="walk" label={moveLabel} wide pressed={moving} onClick={() => onChange(true)} />
        </div>
      </Well>
    </Section>
  );
}
