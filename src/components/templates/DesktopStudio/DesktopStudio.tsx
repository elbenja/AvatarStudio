import { useState } from 'react';
import type { StudioTemplateProps } from '../../../state/controller';
import { Logo } from '../../molecules/Logo/Logo';
import { DownloadBar } from '../../molecules/DownloadBar/DownloadBar';
import { Rail } from '../../molecules/Rail/Rail';
import { StartVoice } from '../../molecules/StartVoice/StartVoice';
import { AboutOverlay } from '../../organisms/AboutOverlay/AboutOverlay';
import { MotionPanel } from '../../organisms/MotionPanel/MotionPanel';
import { Sidebar } from '../../organisms/Sidebar/Sidebar';
import { Stage } from '../../organisms/Stage/Stage';
import './DesktopStudio.css';

const PANEL_ID = 'sd-motion-panel';

/** Full-bleed stage with floating chrome: logo and downloads on top, tools on the left, controls on the right, voice below. */
export function DesktopStudio({ state, actions, downloads, live }: StudioTemplateProps) {
  const [motionOpen, setMotionOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const toggleMotion = () => setMotionOpen((o) => !o);

  return (
    <main className="sd-desk">
      <div className="sd-desk-stage">
        <Stage {...state} live={live} pad={1.2} onTurn={actions.setTurn} onMood={actions.setMood} />
      </div>

      <div className="sd-desk-logo sd-in">
        <Logo />
      </div>

      <div className="sd-desk-bar">
        <div className="sd-in sd-in-1">
          <DownloadBar png={downloads.png} html={downloads.html} onPng={downloads.savePng} onHtml={downloads.saveHtml} />
        </div>
      </div>

      <div className="sd-desk-voice">
        <div className="sd-in sd-in-2">
          <StartVoice />
        </div>
      </div>

      <div className="sd-desk-rail">
        <div className="sd-in sd-in-2">
          <Rail
            paused={state.paused}
            motionOpen={motionOpen}
            onNextEmotion={actions.nextMood}
            onResetView={actions.resetView}
            onTogglePause={actions.togglePause}
            onToggleMotion={toggleMotion}
            onAbout={() => setAboutOpen(true)}
          />
        </div>
      </div>

      <div className={'sd-desk-panel' + (motionOpen ? '' : ' is-closed')} inert={!motionOpen}>
        <MotionPanel
          id={PANEL_ID}
          speed={state.speed}
          turn={state.turn}
          onSpeed={actions.setSpeed}
          onTurn={actions.setTurn}
          onClose={toggleMotion}
        />
      </div>

      <div className="sd-desk-side sd-in sd-in-3">
        <Sidebar
          who={state.who}
          mood={state.mood}
          moving={state.moving}
          onWho={actions.setWho}
          onMood={actions.setMood}
          onMoving={actions.setMoving}
        />
      </div>

      <AboutOverlay open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
