# The Manor — UI Style Board Spec

> Companion doc for the "UI Style Board" prompt. Read this fully before designing.
> Sourced from: `template_sketch.jpeg` (layout/proportion/interaction notes) + 4 Illustrator
> mockups (`0_landing`, `1_adventure`, `2_combat_1`, `3_combat_2`), all at 750×1625px
> (portrait mobile). Colors below were sampled directly from those files, not guessed.

## 1. Concept in one line

A narrative horror mobile game, D&D-inflected combat, hero's-journey structure. The whole
UI is written as if it's a physical object — a haunted manor's ledger, torn pages, ink
illustrations — not a conventional app chrome.

## 2. The two-register typography system

This is the single most important rule of the whole UI: **the world never speaks in the
same hand as the player.**

| Register | Font | Voice | Used for |
|---|---|---|---|
| **Scribble** | Rock Salt | The player acting | Buttons, menu choices (NEW GAME / CONTINUE), tactic/action labels (SWITCH STANCE, SKIP, USE ITEM, NEXT ROUND), the landing title (with squigglevision jitter, see §6) |
| **Gothic / Room title** | Aktura | The place announcing itself | Screen/room titles ("The Threshold", "The Mirror"), the "The Manor 2027" masthead, credits colophon |
| **Scribe (serif)** | IM Fell English | The world telling the player what's happening | Narrative body copy ("You have chosen your adventurer…"), enemy names, enemy/event description text, stat labels |

Do not substitute a system serif or a generic script font for these — the contrast between
Rock Salt's looseness and IM Fell English's formality *is* the game's tone.

## 3. Color tokens (sampled from the Illustrator files)

| Token | Hex | Where it appears |
|---|---|---|
| `parchment-light` | `#ece3d8` | Adventure/landing card & page background, lightest tone |
| `parchment-mid` | `#e6dac5` | Base page background, stained paper |
| `parchment-dark` | `#dbcfbd` | Shadowed/stained parchment areas |
| `ink-black` | `#0a0a0a` | Illustration linework, scribble strokes, gothic type |
| `combat-void` | `#1a1a1a` | Combat-mode UI background (enemy panel, header, nav) |
| `brown-vignette` | `#4b3f3d` | Soft vignette/shadow blending art into parchment |
| `accent-red` | `#e21415` | High-emphasis marker-red (menu item text, key UI accents) |
| `stat-body` (red) | `#a83d3d` | Body stat bar/icon |
| `stat-defense` (blue) | `#7290bd` | Defense stat bar/icon |
| `stat-determination` (gold) | `#bd9834` | Determination stat bar/icon |
| `stat-stamina` (green) | `#79a971` | Stamina stat bar/icon |

Note the deliberate split: `accent-red` (bright, saturated) is reserved for player-facing
emphasis/CTAs, while `stat-body` is a duller, bloodier red — don't merge these two reds.

## 4. Layout grid — "Game View" system (from the sketch)

Every screen shares one vertical proportion system:

```
┌───────────────────────┐
│ Progress bar   (1/6)   │  ← thin bar, top
├───────────────────────┤
│                        │
│      Main area   (1)   │  ← dominant content: card / illustration / combat table
│                        │
├───────────────────────┤
│   Sub area   (1/2 +)   │  ← see breakdown below
└───────────────────────┘
```

**Sub area** is itself two stacked pieces:
- **Section area** — overlaid, slides vertically, height is variable depending on content
  (e.g. the stat panel, or a combat tactics/actions/results switcher).
- **Menu toggle bar** — fixed height (~1/10 of screen), always at the very bottom, 3 icons:
  profile/stats, inventory (shield emblem), menu (hamburger).

## 5. Screen specs

### 5a. Landing / Main Menu
- Full-bleed stained-parchment background.
- A rotatable, gently auto-tilting 3D icon of the manor sits above the title (per sketch:
  "manor 3D tilting").
- Title reads **"THE MANOR"**, set vertically, in Rock Salt, and treated as an *endless
  vertical scroll/loop* — it should feel like it's always mid-unroll, never static.
- "The Manor 2027" masthead + credits colophon, both Aktura, rotated to run vertically in
  the margins.
- Two menu items — NEW GAME / CONTINUE — Rock Salt with `accent-red` on the active word,
  thin hairline underline beneath each.
- Full ink illustration of the manor on its rock outcrop, centered, high-contrast
  cross-hatch style.

### 5b. Adventure mode ("card" screen — e.g. "The Threshold")
- Main area = a single **card**, styled as an aged paper roll: ruined/torn edge borders,
  moss staining, sitting over a full-bleed illustration.
- Cards behave like an infinite vertical scroll/stack, held in place with spring physics —
  they don't just snap, they settle.
- The player can drag a card aside (to the right) to peek at the illustration underneath
  before it's covering.
- Card anatomy, top to bottom: event image (fades in from black + zooms in on entry) →
  narrative text (IM Fell English) → actions row (always pinned to the card's bottom).
- **Card is bright** — this mode stays on `parchment-light`/`parchment-mid`, unlike combat.
- A distinctive micro-interaction seen in the reference: a line of narrative text can get a
  strikethrough correction, as if the manor already knows what you did and is overwriting
  your intent ("DO THIS" → struck through → replaced by "YOU DID THIS"). Treat this as a
  reusable "self-correcting text" effect for moments the game wants to feel fated rather
  than chosen.
- Bottom sub area: character portrait + 4 stat bars (Body / Defense / Determination /
  Stamina), each with icon, IM Fell English label, and a segmented bar showing `n/10`.

### 5c. Combat mode (e.g. "The Mirror")
- **UI is dark** — `combat-void` background throughout, inverted from adventure mode.
- Header: enemy portrait thumbnail (sketchy ink), enemy name in IM Fell English, and the
  enemy's Body/HP bar only (no other enemy stats are shown — sketch specifies "only HP &
  bonus/malus").
- Below the header: enemy description text, IM Fell English, on the dark background.
- **Versus table**: screen splits into a light player panel (left) and a dark enemy panel
  (right), divided by a small hand/claw glyph. Each side shows:
  - `ATK` — a count × a D&D polyhedral die (d4/d6/d8/d12/d20/d100 per the sketch's die key)
  - `DEF` — either a die, a dash (no defense bonus), or — for special enemies — a boxed
    label pointing at a stat instead of a flat number (e.g. enemy DEF = "BODY", flagged
    with a "Special!" tag)
  - Dice are drawn **filled** when a roll is pending and **outlined with the rolled number**
    once resolved.
- Below the versus table, a 3-phase switcher: **TACTICS → ACTIONS → RESULTS**.
  - Tactics: SWITCH STANCE / SKIP / USE ITEM
  - Actions: DEF / ATK / FLEE (per sketch)
  - Once a phase resolves it gets struck through and the next phase underlines/activates —
    phases are not tabs the player can jump between at will, they're a completed sequence.
  - Results: shows the resolved dice face-up, the stat delta inline in red (e.g. "-3"), and
    circles the exact bar segments that were just consumed, before a "NEXT ROUND" button.
- Bottom sub area: identical stat-bar component to adventure mode, so the player always
  sees Body/Defense/Determination/Stamina in the same place regardless of mode.

## 6. Animation & interaction inventory

| Effect | Where | Description |
|---|---|---|
| Squigglevision title | Landing | The vertical "THE MANOR" wordmark has a constant hand-jitter — like each frame is very slightly redrawn, per classic squigglevision |
| Endless vertical scroll | Landing | Title loops/unspools continuously rather than sitting static |
| Spring-loaded card stack | Adventure | Cards scroll with spring physics, settle rather than snap |
| Peek-drag | Adventure | Dragging a card right reveals the illustration underneath |
| Image reveal | Adventure | Event images fade in from black and zoom in slightly on entry |
| Self-correcting text | Adventure (narrative beats) | A line strikes through and is overwritten, implying predetermination |
| Dice roll | Combat | Filled die → roll animation → outlined die showing the resolved number |
| Stat depletion pulse | Combat results | The consumed bar segments get circled/highlighted alongside the numeric delta |
| Phase strike-through | Combat | Completed phase labels (Tactics, Actions) get struck through as combat progresses |

## 7. Component list (for later componentization)

Not needed for the style board itself, but useful context for whoever builds this later in
React (`/fx`, `/layout`, `/components`):

- `StatBar` (icon + label + segmented bar, 4 color variants: body/defense/determination/stamina)
- `NarrativeCard` (image + IM Fell English text + pinned actions row + peek-drag + spring scroll)
- `DiceGlyph` (filled/pending vs outlined/resolved states, 6 die-face variants)
- `VersusPanel` (light player half / dark enemy half, ATK/DEF rows, Special flag)
- `PhaseSwitcher` (Tactics/Actions/Results, sequential, strike-through-on-complete)
- `BottomNav` (3-icon fixed toggle bar: profile, inventory, menu)
- `SelfCorrectingText` (strike-through + reveal micro-interaction)

## 8. Open questions / assumptions to flag back to Iacopo

- Exact die faces beyond d4 (d6/d8/d12/d20/d100) aren't shown in the 4 mockups — only
  specified in the sketch's dice key. Style board should show the whole set as a specimen.
- The "bonus/malus" icon language for enemies isn't shown in the mockups — only named in
  the sketch. Worth a placeholder glyph in the board, flagged as TBD.
- Whether `accent-red` and `stat-body` red should ever be the same value, or stay
  deliberately distinct (current recommendation: keep distinct, see §3).
