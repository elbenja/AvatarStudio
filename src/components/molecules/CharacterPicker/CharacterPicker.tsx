import type { CSSProperties } from 'react';
import { CHARACTERS } from '../../../avatar/characters';
import type { CharacterId } from '../../../avatar/types';
import { CharacterTile } from '../../atoms/CharacterTile/CharacterTile';
import { Section } from '../../atoms/Section/Section';
import './CharacterPicker.css';

export interface CharacterPickerProps {
  who: CharacterId;
  onPick: (id: CharacterId) => void;
  /** 2 in the sidebar, 4 across a phone sheet. */
  cols?: 2 | 4;
  /** The sidebar can fold it away; a phone sheet shows it whole. */
  collapsible?: boolean;
}

export function CharacterPicker({ who, onPick, cols = 2, collapsible = true }: CharacterPickerProps) {
  return (
    <Section title="Character" collapsible={collapsible}>
      <div className="sd-chars" style={{ '--cols': cols } as CSSProperties}>
        {CHARACTERS.map((c) => (
          <CharacterTile key={c.id} character={c} on={c.id === who} onPick={(picked) => onPick(picked.id)} />
        ))}
      </div>
    </Section>
  );
}
