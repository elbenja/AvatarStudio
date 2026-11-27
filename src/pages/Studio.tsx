import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useStudioController } from '../state/controller';
import { DesktopStudio } from '../components/templates/DesktopStudio/DesktopStudio';
import { MobileStudio, tick } from '../components/templates/MobileStudio/MobileStudio';
import { Onboarding } from '../components/templates/Onboarding/Onboarding';
import { CARD_LEAVE_MS } from '../components/organisms/AboutOverlay/AboutOverlay';
import { preloadAvatars, whenQuiet } from '../avatar/mount';

/** Below this width the floating desktop chrome would crowd the stage, so the phone layout takes over. */
export const DESKTOP_QUERY = '(min-width: 960px)';

/** The onboarding card greets first-time visitors only; after that, About in the rail brings it back. */
const SEEN_KEY = 'avatar-studio:onboarded';
const seenIntro = () => { try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; } };
const markIntroSeen = () => { try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked */ } };

/**
 * The page owns the studio state; the templates only lay it out. Switching layouts at the breakpoint keeps
 * the character, emotion and motion settings as they were.
 */
export function Studio() {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const studio = useStudioController(desktop ? undefined : tick);

  const [intro, setIntro] = useState<'open' | 'leaving' | null>(() => (seenIntro() ? null : 'open'));
  const leaveTimer = useRef(0);
  useEffect(() => () => clearTimeout(leaveTimer.current), []);
  // Every character's module is fetched once the page settles, so a pick only has to sculpt.
  useEffect(() => whenQuiet(preloadAvatars), []);
  // The card leaves first and releases its 3D; then the studio's own character starts.
  const dismiss = () => {
    if (intro !== 'open') return;
    markIntroSeen();
    setIntro('leaving');
    leaveTimer.current = window.setTimeout(() => setIntro(null), CARD_LEAVE_MS);
  };

  const live = intro === null;
  return (
    <Onboarding phase={intro} onContinue={dismiss}>
      {desktop ? <DesktopStudio {...studio} live={live} /> : <MobileStudio {...studio} live={live} />}
    </Onboarding>
  );
}
