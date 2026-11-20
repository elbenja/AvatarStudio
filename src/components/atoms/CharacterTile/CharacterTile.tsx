import type { Character } from '../../../avatar/characters';
import './CharacterTile.css';

export interface CharacterTileProps {
  character: Character;
  on: boolean;
  onPick: (character: Character) => void;
}

export function CharacterTile({ character, on, onPick }: CharacterTileProps) {
  return (
    <button
      type="button"
      className={'sd-tile' + (on ? ' is-on' : '')}
      aria-pressed={on}
      aria-label={character.title}
      onClick={() => onPick(character)}
    >
      <img src={character.tile} alt="" width={240} height={240} decoding="async" />
      <span className="sd-tile-name" aria-hidden="true">{character.name}</span>
    </button>
  );
}
