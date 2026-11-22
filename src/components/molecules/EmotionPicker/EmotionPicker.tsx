import type { CSSProperties } from 'react';
import { EMOTIONS } from '../../../avatar/characters';
import type { Mood } from '../../../avatar/types';
import { EmotionKey } from '../../atoms/EmotionKey/EmotionKey';
import { Section, Well } from '../../atoms/Section/Section';
import './EmotionPicker.css';

export interface EmotionPickerProps {
  mood: Mood;
  onPick: (mood: Mood) => void;
  cols?: 3 | 4;
}

export function EmotionPicker({ mood, onPick, cols = 3 }: EmotionPickerProps) {
  return (
    <Section title="Emotion" meta={mood >= 0 ? EMOTIONS[mood] : 'Neutral'} collapsible>
      <Well>
        <div className="sd-keys" style={{ '--cols': cols } as CSSProperties}>
          {EMOTIONS.map((label, i) => (
            // Picking the active emotion again returns the character to neutral.
            <EmotionKey key={label} mood={i} on={i === mood} onPick={(m) => onPick(m === mood ? -1 : m)} />
          ))}
        </div>
      </Well>
    </Section>
  );
}
