import { CHARACTERS } from '../../../avatar/characters';
import type { CharacterId } from '../../../avatar/types';
import { Swatch } from '../../atoms/Swatch/Swatch';
import './SwatchRow.css';

export interface SwatchRowProps {
  who: CharacterId;
  onPick: (id: CharacterId) => void;
}

/** The four characters as their signature colours. */
export function SwatchRow({ who, onPick }: SwatchRowProps) {
  return (
    <div className="sd-swatches" role="group" aria-label="Characters">
      {CHARACTERS.map((c) => (
        <Swatch key={c.id} color={c.color} label={c.name} on={c.id === who} onPick={() => onPick(c.id)} />
      ))}
    </div>
  );
}
