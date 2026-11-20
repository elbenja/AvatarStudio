import { useMediaQuery } from '../hooks/useMediaQuery';
import { useStudioController } from '../state/controller';
import { DesktopStudio } from '../components/templates/DesktopStudio/DesktopStudio';
import { MobileStudio, tick } from '../components/templates/MobileStudio/MobileStudio';

/** Below this width the floating desktop chrome would crowd the stage, so the phone layout takes over. */
export const DESKTOP_QUERY = '(min-width: 960px)';

/**
 * The page owns the studio state; the templates only lay it out. Switching layouts at the breakpoint keeps
 * the character, emotion and motion settings as they were.
 */
export function Studio() {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const studio = useStudioController(desktop ? undefined : tick);
  return desktop ? <DesktopStudio {...studio} /> : <MobileStudio {...studio} />;
}
