import { characterById } from '../../../avatar/characters';
import type { CharacterId, Mood } from '../../../avatar/types';
import { GET_YOURS_URL } from '../../../config';
import { Button } from '../../atoms/Button/Button';
import { CharacterPicker } from '../../molecules/CharacterPicker/CharacterPicker';
import { EmotionPicker } from '../../molecules/EmotionPicker/EmotionPicker';
import { MotionSwitch } from '../../molecules/MotionSwitch/MotionSwitch';
import './Sidebar.css';

export interface SidebarProps {
  who: CharacterId;
  mood: Mood;
  moving: boolean;
  onWho: (id: CharacterId) => void;
  onMood: (mood: Mood) => void;
  onMoving: (moving: boolean) => void;
}

export function Sidebar({ who, mood, moving, onWho, onMood, onMoving }: SidebarProps) {
  return (
    <aside className="sd-side" aria-label="Character controls">
      <div className="sd-side-top">
        <Button href={GET_YOURS_URL} kind="solid" wide glyph="bag" glyphEnd="arrow" label="Get yours" />
      </div>
      <CharacterPicker who={who} onPick={onWho} />
      <EmotionPicker mood={mood} onPick={onMood} />
      <MotionSwitch moving={moving} moveLabel={characterById(who).moveLabel} onChange={onMoving} />
    </aside>
  );
}
