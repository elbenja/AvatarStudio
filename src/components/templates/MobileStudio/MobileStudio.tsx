import { useState } from 'react';
import type { StudioTemplateProps } from '../../../state/controller';
import { GET_YOURS_URL } from '../../../config';
import { Button } from '../../atoms/Button/Button';
import { Section } from '../../atoms/Section/Section';
import { Logo } from '../../molecules/Logo/Logo';
import { CharacterPicker } from '../../molecules/CharacterPicker/CharacterPicker';
import { DownloadBar } from '../../molecules/DownloadBar/DownloadBar';
import { EmotionPicker } from '../../molecules/EmotionPicker/EmotionPicker';
import { MotionSwitch } from '../../molecules/MotionSwitch/MotionSwitch';
import { Rail } from '../../molecules/Rail/Rail';
import { AboutOverlay } from '../../organisms/AboutOverlay/AboutOverlay';
import { BottomSheet } from '../../organisms/BottomSheet/BottomSheet';
import { MotionPanel } from '../../organisms/MotionPanel/MotionPanel';
import { Stage } from '../../organisms/Stage/Stage';
import { TabBar, type Tab } from '../../organisms/TabBar/TabBar';
import './MobileStudio.css';

type Panel = 'character' | 'emotion' | 'motion' | 'download';

const TABS: readonly Tab<Panel>[] = [
  { id: 'character', label: 'Character', glyph: 'person' },
  { id: 'emotion', label: 'Emotion', glyph: 'smile' },
  { id: 'motion', label: 'Motion', glyph: 'curve' },
  { id: 'download', label: 'Download', glyph: 'download' },
];
const SHEET_ID = 'sd-sheet';

/** A short tick on phones that support it: the choice registered. */
export const tick = () => { try { navigator.vibrate?.(8); } catch { /* not available */ } };

/** One sheet with four contents over a stage that steps back so the character is never covered. */
export function MobileStudio({ state, character, actions, downloads, live }: StudioTemplateProps) {
  const [open, setOpen] = useState<Panel | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [last, setLast] = useState<Panel>('character');
  const [opens, setOpens] = useState(0);
  // The sheet keeps its last content while it slides away.
  const shown = open ?? last;

  const toggle = (panel: Panel) => {
    tick();
    if (open === panel) { setOpen(null); return; }
    setOpen(panel);
    setLast(panel);
    setOpens((n) => n + 1);
  };
  const withTick = <A extends unknown[]>(fn: (...a: A) => void) => (...a: A) => { tick(); fn(...a); };

  const lift = !open ? '' : open === 'motion' ? ' is-lifted-more' : ' is-lifted';

  return (
    <main className="sd-phone">
      <div className="sd-phone-top">
        <Logo />
        <Button href={GET_YOURS_URL} kind="solid" glyph="bag" glyphEnd="arrow" label="Get yours" className="sd-phone-cta" />
      </div>

      <div className={'sd-phone-stage' + lift}>
        <Stage {...state} live={live} pad={1.1} onTurn={actions.setTurn} onMood={actions.setMood} />
      </div>

      {/* About floats over the stage, bottom-left above the tabs; it steps aside while a sheet is open. */}
      <div className={'sd-phone-rail' + (open ? ' is-hidden' : '')} inert={open !== null}>
        <Rail compact onAbout={() => { tick(); setOpen(null); setAboutOpen(true); }} />
      </div>

      <div className="sd-phone-sheet">
        <BottomSheet id={SHEET_ID} open={open !== null} label={TABS.find((t) => t.id === shown)!.label} contentKey={`${shown}-${opens}`} onClose={withTick(() => setOpen(null))}>
          {shown === 'character' && <CharacterPicker cols={4} who={state.who} onPick={withTick(actions.setWho)} />}
          {shown === 'emotion' && <EmotionPicker cols={4} mood={state.mood} onPick={withTick(actions.setMood)} />}
          {shown === 'motion' && (
            <>
              <MotionSwitch row moving={state.moving} moveLabel={character.moveLabel} onChange={withTick(actions.setMoving)} />
              <div className="sd-phone-sliders">
                <MotionPanel speed={state.speed} bounce={state.bounce} turn={state.turn} onSpeed={actions.setSpeed} onBounce={actions.setBounce} onTurn={actions.setTurn} />
              </div>
            </>
          )}
          {shown === 'download' && (
            <Section title="Download" meta={character.name}>
              <DownloadBar flat png={downloads.png} html={downloads.html} onPng={downloads.savePng} onHtml={downloads.saveHtml} />
            </Section>
          )}
        </BottomSheet>
      </div>

      <div className="sd-phone-tabs">
        <TabBar tabs={TABS} open={open} last={last} controls={SHEET_ID} onToggle={toggle} />
      </div>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
