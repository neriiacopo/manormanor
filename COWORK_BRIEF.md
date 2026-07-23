# The Manor — React scaffold: handoff brief

This is a **skeleton**, not a finished build: every component is functionally wired
(correct props, correct nesting, correct token usage) but visually undressed. The job
is to bring it up to the fidelity of the 4 reference mockups and the sketch, both
included alongside this scaffold. Read `the-manor-ui-style-board.md` first — it's the
full visual spec (typography, colors, layout proportions, per-screen breakdown,
animation inventory) that everything below implements the skeleton of.

## Stack

| Concern | Choice | Why |
|---|---|---|
| 3D | React Three Fiber + drei | Already used elsewhere in the project; landing manor loads `textured.glb` directly |
| Physics/spring animation | Framer Motion | Card drag/spring stack, dice tumble illusion |
| Scripted animation | GSAP | SquiggleFx jitter — precise timeline control, not physics |
| State | Zustand | Matches rest of the project |
| Styling | CSS Modules + `theme/tokens.css` | All colors/fonts/proportions are CSS custom properties — never hardcode a hex or font-family in a component |

Deliberately **not** using a full UI kit (MUI/Chakra/Ant) — the visual language is too
bespoke to fight a library's defaults. `ScribbleBox`/`ScribbleDivider`/dice/stats are
fully custom. If accessibility/keyboard handling on the phase switcher or menu toggle
needs to be more robust than the current plain buttons, Radix UI primitives (unstyled)
are the recommended drop-in — see the TODO in `CombatMode.jsx`.

## Folder structure

```
src/
  fx/            SquiggleFx, StainedBox, RoughBox — reusable visual effects
  components/    ScribbleBox, ScribbleDivider, Die, ProgressBar, Stats — atomic UI
  layout/        Landing, GameView, sub/{ProgressArea,MainArea,SubArea}
  views/         AdventureMode, CombatMode — the two game "modes" that mount in MainArea
  store/         useGameStore (zustand)
  theme/         tokens.css — single source of truth for color/type/layout tokens
```

## The Die decision (r3f vs 2D)

Went with a **flat 2D SVG/CSS diamond glyph** (Framer Motion for the tumble illusion),
not React Three Fiber. The reference mockups (`2_combat_1.png`, `3_combat_2.png`) show
a flat filled/outlined diamond, not a rendered 3D solid — the art style doesn't ask for
true 3D. Building correct polyhedral geometry for d4/d6/d8/d12/d20/d100 (especially
d100, conventionally a paired d10) is real complexity that wouldn't show up visually
given the flat aesthetic. `Die.jsx`'s props (`sides`, `count`, `rolling`, `result`) are
kept deliberately implementation-agnostic so an R3F version could be swapped in later
without touching `CombatMode.jsx`.

## What's real vs. placeholder

**Wired correctly, needs visual work:**
- Layout proportions (Game View 1/6 : 1 : 1/2+ as flex ratios) — tune against real devices
- Stat bar segment math, phase switcher sequencing, dice roll → result flow

**Explicitly stubbed, flagged `TODO(cowork)` inline:**
- Card stack (currently renders one static card, not an infinite spring-scroll stack)
- Peek-drag reveal of the image behind a card
- Image fade-from-black + zoom on card mount
- "Self-correcting text" strike-through/reveal effect (not built yet — candidate for a
  new `fx/SelfCorrectingText`)
- Landing title's endless vertical scroll loop (currently static vertical text + jitter)
- Enemy "Special!" tag + boxed DEF-tied-to-stat treatment (e.g. The Mirror's DEF = Body)
- Real icon set for the 3-icon toggle bar (currently letter placeholders)
- RoughBox's torn-edge clip-path is a placeholder shape, not art-directed against the mockups
- Aktura font licensing/hosting unconfirmed — Rock Salt and IM Fell English are both
  Google Fonts and safe to self-host as-is

## Setup

Add to the existing project's dependencies (not included as a package.json here since
this scaffold merges into your current repo):

```
npm install framer-motion gsap zustand @react-three/fiber @react-three/drei three
```

Drop `textured.glb` into `public/models/` (or update the path in `Landing.jsx`).
