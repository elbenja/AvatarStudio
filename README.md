# Avatar Studio · Silverdesk Lab

A studio for four hand-sculpted Three.js characters. Pick a character, give it one of 8 emotions, make it walk
(or skate), tune its speed, bounce and turn, then download it as a transparent PNG or a single HTML file.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # checks that every character page can still be wired into the studio
npm run build
```

## How it is put together

```
html/                    The characters. Each is a standalone page and the single source of truth.
vite/avatar-source.ts    Turns each page into a mountable module at build time.
src/avatar/              Runtime: mount a character into any element; the character catalog.
src/styles/tokens.css    Design tokens: colour, radius, elevation, motion, type, touch size.
src/components/
  atoms/                 Icon, Button, IconButton, Slider, CharacterTile, EmotionKey, Section
  molecules/             Logo, DownloadBar, Rail, CharacterPicker, EmotionPicker, MotionSwitch
  organisms/             Stage, MotionPanel, Sidebar, TabBar, BottomSheet
  templates/             DesktopStudio, MobileStudio: layout only, no studio state
src/state/               One reducer for the studio, and the controller both templates receive
src/pages/Studio.tsx     Owns the state and picks the template at 960px
```

Every component folder holds its `.tsx` and its `.css`. Components only reference tokens, never raw values.

## Decisions

**The HTML files stay the source of truth.** Each character was first built as one self-contained page, and
that page is still what people download. Rather than fork the 3D code into the app, `vite/avatar-source.ts`
reads each page at build time, lifts out its module, and swaps the handful of places where it touches the
window (size, resize, render loop, clock, background) for a host the studio controls. That is how the speed,
bounce, turn and pause controls work without touching the character code. Every swap is checked: if a page
drifts from the expected shape, the build fails and names the anchor that broke, and `npm test` checks all
four pages.

**Only the character on stage costs anything.** Each character is its own lazily loaded chunk of 13–17 KB
gzipped, plus a shared Three.js chunk. A character is sculpted the first time it is picked and keeps its
own canvas afterwards, so switching back is instant. Only the visible one renders, and only while the stage is
on screen and the tab is in front. Each page's own adaptive quality (fewer pixels, then fewer fur shells)
carries over unchanged.

**No jump from poster to 3D.** Sculpting blocks the main thread for a moment, so an 800px WebP poster
(44 KB, down from an 828 KB PNG) is decoded and painted first. It is sized with the same framing maths as the
camera, using numbers read from each page at build time, so the crossfade lands on the same spot.

**State flows one way, the camera both ways.** Dragging the stage moves the Turn slider, and moving the
slider turns the camera. Tapping a character makes it hop and return to neutral; the picker follows, because
the runtime watches the character's own emotion state.

**Accessible as built.** Native buttons, links and range inputs throughout; toggles announce `aria-pressed`;
icon-only buttons are labelled; the closed motion panel and sheet are `inert`; 44px hit areas, including the
small close chips; reduced motion starts the character standing, softens its bounce, and turns UI animation
off.

## Not done yet

- "Get yours" and the "+" links point at silverdesk.com until the landing page exists (`VITE_GET_YOURS_URL`).
- The About button in the design has no destination, so the rail leaves it out until it has one.
