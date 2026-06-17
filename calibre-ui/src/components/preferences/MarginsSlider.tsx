'use client';

/**
 * ==========================================================================
 * Calibre-UI — MarginsSlider
 * The App 06 Preferences "Content margins" slider section.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `MarginsSlider` is the labelled margins-slider SECTION rendered inside the
 * right-hand Settings Panel of the App 06 Preferences screen (Figma screen
 * `8:2`, settings-panel node `8:33`, margins sub-section nodes `8:98`–`8:102`)
 * in the UI-only Calibre e-book-manager prototype (Next.js 15 App Router ·
 * React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It pairs a
 * "Content margins" caption with the design-system {@link Slider} primitive and
 * an inline purple value readout, all bound to the shared `marginsPx` setting.
 *
 * It is a thin COMPOSITION layer: the track, fill, knob, focus halo, and all
 * range behaviour live in the `Slider` primitive; the live value + its setter
 * live in `PreferencesProvider`. This component only arranges the caption, the
 * slider, and the value, and wires the slider to the Context.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * It consumes the {@link usePreferences} Context hook and binds the slider's
 * `onChange` to the `setMargins` action, so it must be a Client Component (App
 * Router components default to Server Components, which cannot run hooks or bind
 * change handlers). The directive is the very first line, before any import.
 * It holds NO local state of its own — the slider value is read straight from
 * Context and every change is written straight back through `setMargins`. It is
 * SSR-safe: no `window` / `Math.random` / `Date.now` / `localStorage` access and
 * no mount-time mutation; the `useId` id is deterministic across server/client.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * The App 06 margins sub-section, reconciled against the same `analyze_figma_node`
 * pass the `Slider` primitive was built from (parent screen `8:2`):
 *   • CAPTION (`8:98`)  → "Content margins", placed ABOVE the track (no unit).
 *   • TRACK (`8:99`)    → rounded `bg-card` pill; FILL (`8:100`) → the vertical
 *     accent gradient; KNOB (`8:101`) → 20px white circle. (All owned by the
 *     `Slider` primitive — this section never re-styles them.)
 *   • VALUE (`8:102`)   → "32 px" (the number AND its unit in ONE node), placed
 *     INLINE to the RIGHT of the track, ~16px gap, vertically centered, color
 *     `#A78BFA` = `--color-accent-light`, Inter Medium (500) 11px.
 * Our mock default `marginsPx` is `64`; with `min=0`/`max=128` the knob rests at
 * exactly 50% (the Figma half-filled track) — see {@link MARGINS_MIN} below.
 *
 * BLITZY [CONTENT] (caption): the agent brief used the placeholder label
 * "Margins"; the CONFIRMED Figma caption (`8:98`) is "Content margins", so —
 * per the CRITICAL Precedence Directive (exact Figma values override brief
 * defaults) — the section renders "Content margins". The AAP §0.3 intent ("a
 * Margins slider, purple-filled track, bound to `marginsPx`") is preserved
 * exactly: this IS that margins slider.
 *
 * BLITZY [COLOR] (value): the brief hypothesized the value text as `text-accent`
 * (#7B61FF). The CONFIRMED Figma value (`8:102`) is `#A78BFA` =
 * `--color-accent-light`, which is also the color the `Slider` primitive uses for
 * its own `showValue` readout — so the value uses `text-accent-light` for an
 * exact Figma match and cross-screen consistency. "Value in purple" intent is
 * preserved (#A78BFA is the light-violet accent and the gradient's upper stop).
 *
 * BLITZY [TYPOGRAPHY] (value): the value uses `text-button-secondary` — the
 * design system's Inter Medium 500 / 11px role token, an EXACT match for Figma
 * `8:102` (and identical to the `Slider` primitive's own value typography). The
 * 10px `text-meta-value` role would read 1px under Figma, so it is not used.
 *
 * BLITZY [TYPOGRAPHY] (caption): the caption uses `text-body` (12px / 400) in the
 * `text-text-secondary` token — identical to the labelled-slider caption of the
 * sibling Convert "Look & Feel" panel (`LookAndFeelPanel`), the established house
 * treatment for a settings field label.
 *
 * BLITZY [LAYOUT] (fluid track): Figma draws a fixed 400px track, but per the
 * agent brief's responsive directive (and the AAP §0.1.3 / §0.7.4 1440→1280
 * no-horizontal-overflow gate) the track is rendered FLUID (`flex-1 min-w-0`)
 * rather than a fixed px width; the parent settings panel governs the section's
 * actual width. The value label stays `shrink-0` so the track absorbs all flex.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / typography value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`text-body`,
 * `text-text-secondary`, `text-button-secondary`, `text-accent-light`). The
 * slider's purple fill, white knob, and focus halo are all token-backed INSIDE
 * the `Slider` primitive — this file adds no color literal. There are NO raw hex
 * / rgba / px-radius / px-font literals. The only bare values are layout/spacing
 * utilities from the Tailwind scale (`flex`, `w-full`, `gap-1.5`, `gap-4`,
 * `flex-1`, `min-w-0`, `shrink-0`) — which carry no design-token information —
 * and the numeric slider DOMAIN bounds (`0` / `128` / `4`), which are data, not
 * CSS.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • The caption is a real `<label htmlFor>` bound to the slider's forwarded `id`
 *   (a `useId`-generated, SSR-safe value), so the rendered `<input type="range">`
 *   gets its accessible NAME from the visible "Content margins" text (WCAG 2.5.3
 *   Label in Name). The `Slider` primitive supplies `role="slider"` +
 *   `aria-valuenow/min/max` from `value`/`min`/`max` automatically.
 * • The visible value readout duplicates `aria-valuenow`, so it is `aria-hidden`
 *   to avoid a double announcement — the input owns the accessible value.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * look_feel.py` (Calibre's Qt look & feel preferences, whose numeric layout/
 * margin settings this slider is the web analog of). Nothing is imported or
 * translated from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/components/primitives/Slider.tsx — the range-control primitive composed here.
 * @see src/state/PreferencesProvider.tsx — owns `marginsPx` + `setMargins`.
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 — Preferences screen + tokens.
 */

import { useId, type JSX } from 'react';
import { Slider } from '@/components/primitives/Slider';
import { usePreferences } from '@/state/PreferencesProvider';

/* --------------------------------------------------------------------------
 * Slider domain bounds (data, not CSS).
 * `marginsPx` defaults to 64; with this 0–128 range the knob rests at exactly
 * 50% — the Figma half-filled track (`8:100`). `step=4` gives smooth, snappy
 * increments across the range.
 * ------------------------------------------------------------------------ */

/** Minimum selectable margin, in px (left end of the track). */
const MARGINS_MIN = 0;
/** Maximum selectable margin, in px (right end of the track). */
const MARGINS_MAX = 128;
/** Drag-snap / arrow-key increment, in px. */
const MARGINS_STEP = 4;

/* --------------------------------------------------------------------------
 * Token-backed class strings (module scope so they are allocated once).
 * Every color/typography value resolves to an `@theme` token; only Tailwind-
 * scale layout/spacing utilities are bare (they carry no token information).
 * ------------------------------------------------------------------------ */

/**
 * The section wrapper: a full-width vertical stack with the caption above the
 * track row, separated by the `gap-1.5` (6px) step — matching the sibling
 * `LookAndFeelPanel` field-label spacing. `w-full` lets the section fill the
 * width the parent settings panel allots (fluid; no fixed track width).
 */
const SECTION_CLASSES = 'flex w-full flex-col gap-1.5';

/**
 * Caption ("Content margins", Figma `8:98`): the `text-body` role (12px / 400)
 * in the secondary slate token — the house settings field-label treatment.
 * `select-none` keeps the label from being drag-selected while working the knob.
 */
const LABEL_CLASSES = 'select-none text-body text-text-secondary';

/**
 * The track row: the flexible slider on the left and the value readout on the
 * right, vertically centered with a `gap-4` (16px) step — the CONFIRMED Figma
 * ~16px gap between the track's right cap and the "32 px" value (`8:102`).
 */
const TRACK_ROW_CLASSES = 'flex w-full items-center gap-4';

/**
 * Merged onto the `Slider` wrapper so the track GROWS to fill the row
 * (`flex-1`) and can also SHRINK below its content (`min-w-0`) — the fluid,
 * overflow-free track (BLITZY [LAYOUT]); the value label absorbs no flex.
 */
const SLIDER_CLASSES = 'flex-1 min-w-0';

/**
 * Value readout ("{marginsPx} px", Figma `8:102`): the light-violet
 * `text-accent-light` (#A78BFA) in the `text-button-secondary` role (Inter
 * Medium 500 / 11px) — identical to the `Slider` primitive's own value styling.
 * `shrink-0` keeps it from being squeezed by the flexible track; `tabular-nums`
 * stops the number from reflowing as digits change; `select-none` avoids stray
 * selection.
 */
const VALUE_CLASSES =
  'shrink-0 select-none tabular-nums text-button-secondary text-accent-light';

/**
 * MarginsSlider — the App 06 Preferences "Content margins" slider section.
 *
 * Reads the live `marginsPx` setting from {@link usePreferences} and renders a
 * "Content margins" caption above the design-system {@link Slider} (bound to the
 * 0–128px range), with the current value shown as "{marginsPx} px" in the
 * light-violet accent token inline to the right of the track. Dragging the knob
 * or pressing the arrow keys writes the new value straight back to Context via
 * `setMargins`, so the purple fill and the readout track the knob in real time.
 * Holds no local state; the only hook beyond the Context is `useId`, for the
 * SSR-safe label↔slider association.
 *
 * @returns The rendered margins-slider section.
 */
export default function MarginsSlider(): JSX.Element {
  const { preferences, setMargins } = usePreferences();
  // SSR-safe, collision-free id linking the visible caption (<label htmlFor>)
  // to the slider's native <input> (forwarded via the primitive's `id` prop).
  const sliderId = useId();

  return (
    <div className={SECTION_CLASSES}>
      <label htmlFor={sliderId} className={LABEL_CLASSES}>
        Content margins
      </label>

      <div className={TRACK_ROW_CLASSES}>
        <Slider
          id={sliderId}
          value={preferences.marginsPx}
          min={MARGINS_MIN}
          max={MARGINS_MAX}
          step={MARGINS_STEP}
          onChange={setMargins}
          className={SLIDER_CLASSES}
        />
        {/* The input owns the accessible value (aria-valuenow); this visible
            readout duplicates it, so it is hidden from assistive tech. */}
        <span aria-hidden="true" className={VALUE_CLASSES}>
          {preferences.marginsPx} px
        </span>
      </div>
    </div>
  );
}
