'use client';

/**
 * ==========================================================================
 * Calibre-UI — ReadingBehaviorGrid
 * The App 06 Preferences "Reading Behavior" 3-column × 2-row toggle grid.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReadingBehaviorGrid` is the 2×3 (rendered as 3 columns × 2 rows) grid of
 * reading-behavior on/off settings inside the App 06 Preferences screen
 * (Figma screen `8:2`), a child section of the Settings Panel (node `8:33`),
 * in the UI-only Calibre e-book-manager prototype (Next.js 15 App Router ·
 * React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It renders
 * EXACTLY the six reading-behavior toggles enumerated by `readingBehaviorOptions`
 * (AAP §0.3.1 / §0.7.4):
 *   Row 1: Continuous Scrolling · Show Reading Progress · Remember Last Position
 *   Row 2: Highlight on Selection · Enable Hyphenation · Auto-Dim at Night
 * Each cell is a glassmorphic card carrying the setting's label on the left and
 * the iOS-style {@link Toggle} switch on the right. The owning `PreferencesPanel`
 * composes this grid beside the Default-Font row, the Viewer-Theme swatches, and
 * the Margins slider; the page-level "Reading Behavior" section heading (when the
 * panel renders one) belongs to that owner, NOT to this grid (single
 * responsibility — this file is the GRID only).
 *
 * UI-ONLY · IN-MEMORY · NO PERSISTENCE
 * --------------------------------------------------------------------------
 * This component owns NO state of its own. It reads the live switch states from
 * {@link usePreferences} (`preferences.readingBehavior`, a `Record<string,
 * boolean>` seeded from `@/data/preferences`) and writes every flip back through
 * the Context action `setBehavior(key, value)`. There is NO backend, NO API, NO
 * database, and NO `localStorage`; a reload resets to the seeded defaults (AAP
 * §0.8.2). The defaults intentionally ship four switches ON and two OFF, so the
 * grid demonstrates BOTH track states out of the box.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The grid calls the `usePreferences` hook and binds `onChange` handlers to each
 * switch, both of which require a Client Component (App Router components default
 * to Server Components, which cannot run hooks or bind event handlers). The
 * directive is the very first line, before any import. The component is
 * deterministic / SSR-safe: it reads only Context state and a static option list,
 * with NO `Math.random`, `Date.now`, `new Date()`, `window`, `document`, or
 * `localStorage` access and NO mount-time mutation, so server and client render
 * identically and the screen hydrates with zero console/hydration errors.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * The cell/label/toggle treatment is reconciled from the CONFIRMED App 06
 * reading-behavior switch reconciliation already captured by the sibling
 * {@link Toggle} primitive (ON instance track `8:53` / knob `8:54`; OFF instance
 * track `8:63` / knob `8:64`) plus the AAP §0.3.2 token manifest and §0.3.3
 * component inventory (which take PRECEDENCE on scope/intent — the 2×3 grid of
 * the six listed toggles). The CONFIRMED switch reconciliation explicitly notes
 * that the "1px white-7% hairline seen in the design belongs to the SURROUNDING
 * CARD, not the [switch] track" — i.e. each reading-behavior setting sits inside
 * a `--color-card` (#181C3C) surface with a `border-white-07` hairline and the
 * `--radius-card` (10px) corner, which is exactly the default {@link GlassCard}
 * `surface="card"` rendering used here. Per-cell layout is a `justify-between`
 * row: label on the start edge, switch on the end edge.
 *
 * BLITZY [COMPONENT] (no visible section header): this file renders the GRID
 * only — it deliberately does NOT render a visible "Reading Behavior" heading.
 * The AAP architecture (§0.7.1 Group 7) gives the wide settings panel its own
 * `PreferencesPanel` owner, which is where any section heading belongs; emitting
 * one here would risk duplicating the panel's heading (DS2-d, no hallucinated
 * elements). The six related switches are instead grouped programmatically via
 * `role="group"` + `aria-label="Reading Behavior"` — invisible accessibility
 * that has zero visual impact and never conflicts with the design.
 *
 * BLITZY [COLOR] (label tone): the setting labels render in the static
 * `--color-text-secondary` (#94A3B8) tone via `text-text-secondary` — the
 * CONFIRMED App 06 secondary-label color (sibling `PreferencesNav`, node `8:15`)
 * and the exact tone named by this file's agent contract skeleton. A
 * "brighten-the-label-to-text-primary-when-ON" treatment exists on the App 05
 * sister grid (`LookAndFeelPanel`), but that is inferred from a DIFFERENT screen
 * and conflicts with this file's explicit directive, so it is intentionally not
 * applied; the switch's own track color (accent gradient ON / `--color-card` OFF)
 * already communicates each state, so color is never the sole state indicator
 * (UI3).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / SURFACE value resolves to an `@theme` token from
 * `src/app/globals.css`: the cell surface, hairline border, and corner radius are
 * supplied by {@link GlassCard} (`bg-card`, `border-[var(--border-white-07)]`,
 * `rounded-card`); the label uses the `text-body` typography-role token (Inter
 * 400 / 12px) in the `text-text-secondary` color token; the switch visuals are
 * fully token-backed inside {@link Toggle}. The only bare values are layout /
 * spacing utilities from the Tailwind scale (`grid`, `grid-cols-3`, `gap-3`,
 * `p-4`, `flex`, `items-center`, `justify-between`, `min-w-0`, `shrink-0`), which
 * carry no color/token information. There are NO raw hex / rgba color or px
 * radius literals anywhere in this file.
 *
 * RESPONSIVE INTEGRITY (AAP §0.7.4 — 1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The grid uses three fluid columns (`grid-cols-3`) with a token-scale `gap-3`
 * and NO fixed pixel column widths, so it reflows cleanly from the 1440px
 * baseline down to the 1280px minimum. `min-w-0` on each cell AND on each label
 * lets a long label shrink/wrap instead of forcing the track wider than its
 * column, and `shrink-0` on the switch keeps the 44px control from ever
 * collapsing — together guaranteeing no horizontal overflow at any supported
 * width.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • The six switches are wrapped in a `role="group"` named `Reading Behavior`,
 *   so assistive tech presents them as one related set.
 * • Every switch is named by its OWN visible label: each label `<span>` gets a
 *   stable, collision-proof id (a single `useId` base suffixed by the option id),
 *   and that id is passed to the switch as `ariaLabelledby`. This is the
 *   gold-standard "associate the visible label" pattern — one accessible name per
 *   switch, no hidden duplicate text — so no switch is ever the generic, anonymous
 *   `aria-label="Toggle"` fallback.
 * • The {@link Toggle} primitive renders a real `<button role="switch"
 *   aria-checked>` that is keyboard-operable (Space/Enter) and shows a
 *   token-backed `:focus-visible` ring for free.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * behavior.py` and `look_feel.py` (the Qt preference controllers whose boolean
 * reading settings this grid is the web analog of — Calibre registers such
 * settings via its `r('<name>', …)` pattern). Nothing is imported or translated
 * from the Python codebase.
 *
 * @see src/components/primitives/Toggle.tsx — the iOS on/off switch primitive.
 * @see src/components/primitives/GlassCard.tsx — the glassmorphic surface primitive.
 * @see src/state/PreferencesProvider.tsx — the settings Context (`usePreferences`).
 * @see src/data/preferences.ts — the six `readingBehaviorOptions` (labels + order).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 — Preferences screen + tokens.
 */

import { useId, type JSX } from 'react';

import { GlassCard } from '@/components/primitives/GlassCard';
import { Toggle } from '@/components/primitives/Toggle';
import { usePreferences } from '@/state/PreferencesProvider';
import { readingBehaviorOptions } from '@/data/preferences';

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once and the
 * token usage is auditable in one place). Every value resolves to an `@theme`
 * token or a token-scale Tailwind layout/spacing utility — no color/radius
 * literals (AAP §0.4.5).
 * ------------------------------------------------------------------------ */

/**
 * The grid container: three fluid columns × two rows with a `gap-3` (12px)
 * gutter. No fixed column widths, so the grid reflows from 1440px to 1280px
 * without horizontal overflow (the six options always lay out 3-up, two rows).
 */
const GRID_CLASSES = 'grid grid-cols-3 gap-u12';

/**
 * One setting cell — the {@link GlassCard} body. A horizontal flex row that
 * pushes the label to the start edge and the switch to the end edge
 * (`justify-between`), vertically centered, with `p-4` (16px) interior padding
 * and a `gap-3` safety gutter between the label and the switch. `min-w-0` lets
 * the cell shrink within its grid column so a long label can wrap instead of
 * forcing overflow. The surface fill, hairline border, and corner radius come
 * from `GlassCard`'s default `surface="card"` rendering.
 */
const CELL_CLASSES = 'flex min-w-0 items-center justify-between gap-u12 p-u16';

/**
 * The setting label: the `text-body` role token (Inter 400 / 12px) in the
 * `text-text-secondary` (#94A3B8) color token — the CONFIRMED App 06 secondary
 * label tone. `min-w-0` lets the label shrink/wrap within the flex row so it
 * never pushes the switch out of the cell.
 */
const LABEL_CLASSES = 'min-w-0 text-body text-text-secondary';

/**
 * Switch placement: `shrink-0` keeps the fixed-width 44px control from ever
 * collapsing when the label is long, so the label absorbs all flex shrink.
 */
const TOGGLE_CLASSES = 'shrink-0';

/**
 * ReadingBehaviorGrid — the App 06 Preferences reading-behavior toggle grid.
 *
 * Renders the six {@link readingBehaviorOptions} as a 3-column × 2-row grid of
 * glassmorphic cells, each pairing the setting's label with its {@link Toggle}
 * switch. The switch state is read from `preferences.readingBehavior` and every
 * flip is written back through `setBehavior`, both from {@link usePreferences}.
 * Takes no props.
 *
 * @returns The rendered reading-behavior toggle grid.
 */
export default function ReadingBehaviorGrid(): JSX.Element {
  // Live settings + the single-toggle setter from the shared Preferences Context.
  // `preferences.readingBehavior` is a `Record<string, boolean>` keyed by the
  // option ids; `setBehavior(key, value)` writes one switch immutably.
  const { preferences, setBehavior } = usePreferences();

  // A stable, SSR-safe id base (React 19 `useId`). Suffixed per option to give
  // each label `<span>` a unique, collision-proof id that names its switch via
  // `aria-labelledby` — robust even if the grid were ever rendered twice.
  const baseId = useId();

  return (
    <div role="group" aria-label="Reading Behavior" className={GRID_CLASSES}>
      {readingBehaviorOptions.map((option) => {
        // The id that ties this cell's visible label to its switch's accessible
        // name. Deterministic (base + option id) → identical on server & client.
        const labelId = `${baseId}-${option.id}`;
        // Defensive `?? false`: should a behavior key ever be absent from the
        // mock map, the switch renders OFF rather than passing `undefined`.
        const checked = preferences.readingBehavior[option.id] ?? false;

        return (
          <GlassCard key={option.id} surface="card" className={CELL_CLASSES}>
            <span id={labelId} className={LABEL_CLASSES}>
              {option.label}
            </span>
            <Toggle
              checked={checked}
              onChange={(value) => setBehavior(option.id, value)}
              ariaLabelledby={labelId}
              className={TOGGLE_CLASSES}
            />
          </GlassCard>
        );
      })}
    </div>
  );
}
