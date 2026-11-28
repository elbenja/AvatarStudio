# Avatar Studio · Silverdesk Lab

**Your brand deserves a face. Preferably a fluffy one.**

**Live at [avatarstudio.silverdesk.com](https://avatarstudio.silverdesk.com)**

## The goal

Avatar Studio started as a Silverdesk Lab experiment: a reason to build and ship something fun in Three.js,
and a place to show what design engineering looks like when one person does both the design and the code.
It got out of hand. Now it is also the shop window for a real service: **custom 3D characters for brands that
need some personality.**

Most brand mascots today are a grey circle, a stock 3D blob, or something a generator made in five seconds.
That's slop, and people can tell. The fix is a character with a point of view: sculpted on purpose, with
details that only make sense for *your* brand, and alive in the browser instead of stuck in a PNG.

## The product: one custom character, one fixed price

Avatar Studio sells one thing, the same way every time: a custom 3D character for your brand, at a fixed scope, price and timeline.

| | |
| --- | --- |
| **What you get** | A custom character sculpted in code, with 8 emotions and 2 moves |
| **Files** | An HTML embed for your site, app or chatbot, plus transparent PNGs of every emotion |
| **Revisions** | 2 rounds on the character image, 2 on the 3D |
| **Timeline** | About 1 week |
| **Price** | **$900** founding offer for the first 5 brands, then **$1,200** |

**How it works**

1. **Send the brief.** Hit **Get yours**, say where the character will live (website, app, social) and describe
   the vibe, the colours and the weird details that make your brand yours. It takes two short steps.
2. **Get a first sketch in 48 hours.** It's free, with no strings attached, so you can see the direction before you commit.
3. **We sculpt it in code.** No 3D files and no textures: every shape is math, rigged with a pose and a motion
   for each emotion and move.
4. **It ships in about a week.** You get one self-contained HTML file and the PNGs, ready to drop in.

The designer also writes the code, so nothing gets lost in a handoff. There are no templates and no dress-up menus.

## The studio

This repo is the studio itself, and the demo of the work. Meet the crew:

| Character | Who | Moves |
| --- | --- | --- |
| **Glace** | Montréal hockey bear: red puffer, striped socks, chunky skates | Stand / Skate |
| **Nova** | Toronto baseball robot: matte vinyl, LED face under the cap | Idle / Walk |
| **Liberty** | A cat in a varsity jacket, with a tail with opinions | Idle / Walk |
| **Chanchito** | The original. A fuzzy pig hood and zero chill when you tap him | Idle / Walk |

Pick one, give it one of 8 emotions (Happy, Euphoric, Surprised, Curious, Sleepy, Sad, Embarrassed, Angry),
make it walk or skate, tune speed, bounce and turn, then take it home as a transparent PNG or a single HTML
file. Drag to spin, tap to hop.

Want one for your brand? Hit **Get yours** in the studio. It opens a two-step brief beside a live character,
and the brief lands straight in our inbox. You can also go to [silverdesk.com](https://silverdesk.com).

## Coming soon: talk to it

The next step is **AI chat**: a character that talks, listens and reacts, with its emotions following the
conversation. The studio already has a **Start Voice** button (marked *Soon*) that previews it with the talking
bear, and the brief lists **Voice AI** as a place a character can live, shown but not yet pickable. Both will
go live together.

## Hosting

The site is deployed on Vercel and served at `avatarstudio.silverdesk.com` through a CNAME at
GoDaddy. It sits on its own subdomain so it stands as a product, apart from the main silverdesk.com site.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # checks that every character page can still be wired into the studio
npm run build
```

**Get yours** in the studio opens the commission page (`/get-yours.html`). Its form posts each brief to the Apps Script
in `google/brief-inbox.gs`, which files it in a Google Sheet and emails it. Set `VITE_BRIEF_URL` to that script's web app
URL (setup steps are at the top of the script); without it the form says it could not send.

## How it is put together

```
html/                    The characters. Each is a standalone page and the single source of truth.
vite/avatar-source.ts    Turns each page into a mountable module at build time.
src/avatar/              Runtime: mount a character into any element; the character catalog.
src/styles/tokens.css    Design tokens: colour, radius, elevation, motion, type, touch size.
src/components/
  atoms/                 Icon, Button, IconButton, Badge, Slider, CharacterTile, EmotionKey, Section,
                         CollapseToggle, Swatch, Tag, Tooltip, TextField, CheckTile, OrbitLoader, Sweep
  molecules/             Logo, DownloadBar, Rail, CharacterPicker, EmotionPicker, MotionSwitch, SwatchRow,
                         Popover, StartVoice
  organisms/             Stage, MotionPanel, Sidebar, TabBar, BottomSheet, OnboardingCard, AboutOverlay,
                         BriefForm, Pitch
  templates/             DesktopStudio, MobileStudio, Onboarding, GetYours: layout only, no studio state
src/state/               One reducer for the studio, and the controller both templates receive
src/pages/Studio.tsx     Owns the state and picks the template at 960px
src/pages/GetYours.tsx   The commission page; src/brief.ts sends its form
google/brief-inbox.gs    Apps Script that receives a brief: a Sheet row and an email
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
