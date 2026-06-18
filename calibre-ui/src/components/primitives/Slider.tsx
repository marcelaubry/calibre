'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Slider
 * The single horizontal range-control primitive (track + fill + knob).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Slider` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE range control used everywhere a raw `<input type="range">`
 * would otherwise appear:
 *   • PREFERENCES — the "Content margins" slider in the App 06 "Margins &
 *     Layout" section (Figma screen `8:2`; track `8:99`, filled bar `8:100`,
 *     knob `8:101`, value label `8:102`). This is the authoritative reference.
 *   • CONVERT — the Look & Feel panel's numeric ranges (margins / base font
 *     size / line height) in the Convert Books dialog (App 05, `6:9`).
 * Screen code must NEVER render an unstyled raw `<input type="range">`; it
 * always composes this primitive so the track, fill, knob, focus ring, and the
 * value label stay identical and 100% token-backed across every screen.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, CONTROLLED `<input type="range">` (its `value`
 * is owned by the caller and every drag / arrow-key step is reported through
 * `onChange`), so it must be a Client Component — App Router components default
 * to Server Components, which cannot bind change handlers. The directive is the
 * very first line of the file, before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the App 06 "Content margins" slider
 * (parent screen `8:2`), TRIPLE-verified by rendered pixels + structural tokens
 * + the exported SVG source (`<rect>` geometry). CONFIRMED values:
 *   • TRACK (`8:99`) → 400×6 px, radius rx=3 (a fully-rounded pill, = half the
 *     6px height). UNFILLED/base fill = `#181C3C` = `--color-card` → `bg-card`.
 *   • FILLED bar (`8:100`) → the left 42.5% of the track, fill =
 *     `linear-gradient(0deg, #7B61FF 0% → #A78BFA 100%)` — a VERTICAL accent
 *     gradient (#7B61FF at the bottom, #A78BFA at the top).
 *   • KNOB (`8:101`) → a 20px-diameter (rx=10) FULL CIRCLE, pure `#FFFFFF`,
 *     NO stroke and NO drop shadow (no effect token; none in the render).
 *   • VALUE LABEL (`8:102`) → "32 px", color `#A78BFA` = `--color-accent-light`,
 *     Inter Medium (500) 11px, placed INLINE to the RIGHT of the track,
 *     vertically centered, ~16px gap.
 *
 * BLITZY [COLOR] (filled track): the agent brief's baseline hypothesized a FLAT
 * `bg-accent` (#7B61FF). analyze_figma_node CONFIRMED the fill is a GRADIENT —
 * the accent color pair #7B61FF→#A78BFA, but at 0deg (VERTICAL), distinct from
 * BOTH the `--gradient-accent` token (which is -45deg) AND the `--gradient-cta`
 * token (#7B61FF→#4838C8, -45deg). On a thin 6px bar a -45deg gradient reads as
 * a left→right transition (clearly wrong); the design is a near-uniform,
 * slightly-lighter-on-top vertical fill. To match Figma's orientation EXACTLY
 * while keeping ZERO hardcoded values, this vertical accent ramp is declared
 * ONCE as the named `--gradient-slider-track` token in globals.css and consumed
 * here via the `bg-gradient-slider-track` utility (`to top` ≡ 0deg:
 * `--color-accent` #7B61FF at the bottom, `--color-accent-light` #A78BFA at the
 * top) — no inline gradient string lives in this component. Per the CRITICAL
 * Precedence Directive (exact Figma values
 * override brief defaults — a default that masks Figma is a hallucination) and
 * the house pattern set by the siblings `Toggle` / `Select` (implement CONFIRMED
 * Figma, flag the deviation). The AAP §0.3.3 intent ("purple-filled track") is
 * preserved exactly — #7B61FF is the gradient's lower stop.
 *
 * BLITZY [COLOR] (unfilled track): the brief hypothesized the unfilled track as
 * `bg-[var(--border-white-09)]` or `bg-surface-2`. The CONFIRMED Figma fill
 * (`8:99`, SVG `fill="#181C3C"`) is the SOLID `--color-card`, so this primitive
 * uses `bg-card` (the same navy as the app's input-field surface).
 *
 * BLITZY [COLOR] (value label): the brief hypothesized the value text as
 * `text-accent` (#7B61FF). The CONFIRMED Figma fill (`8:102`) is `#A78BFA` =
 * `--color-accent-light`, so this primitive uses `text-accent-light`. Intent
 * ("value in purple") is preserved — #A78BFA is the light-violet accent and is
 * the gradient's upper stop, so the value visually rhymes with the filled bar.
 *
 * BLITZY [TYPOGRAPHY] (value label): the brief suggested `text-meta-value` (10px)
 * or `text-body` (12px). The CONFIRMED Figma value (`8:102`, style `FH2HSH`) is
 * Inter Medium 500 / 11px. compare_screenshot_with_figma (8:2) flagged the 10px
 * `text-meta-value` rendering as a 1px deviation, so — per the CRITICAL Precedence
 * Directive (exact Figma values override brief defaults; a default that masks
 * Figma is a hallucination) — the value label uses `text-button-secondary`, the
 * design system's 11px/500 role token (identical metrics to Figma's value text;
 * the nearest small-control-label role, since the `meta-value` role is 10px).
 * This achieves exact 11px/500 parity while keeping the value 100% token-backed.
 *
 * BLITZY [SIZE] (knob): the brief estimated ~14–18px. The CONFIRMED Figma knob
 * (`8:101`, SVG `<rect width=20 height=20 rx=10>`) is a 20px circle → `h-5 w-5`.
 * NO resting drop shadow is added (Figma defines none; adding one would
 * hallucinate an effect — DS2-d). A keyboard-only `:focus-visible` halo is the
 * one box-shadow, and it is a state affordance (invisible at rest), not decor.
 *
 * VALUE-LABEL UNIT (scope boundary): Figma renders "32 px", but the unit is
 * screen-specific (margins → "px", Convert base font size → "pt", line height →
 * "x"). This generic primitive's contract is `value: number`, so it renders the
 * bare number; the consuming screen component composes any unit (e.g. an
 * adjacent "px" label), exactly as the App 06 / App 05 screens require. The
 * "Content margins" caption (`8:98`) above the track is likewise a SCREEN-level
 * concern, not part of this primitive.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR value resolves to an `@theme` token from `src/app/globals.css`,
 * consumed via a Tailwind v4 utility (`bg-card`, `text-accent-light`,
 * `text-button-secondary`) or a CSS-variable arbitrary value (the filled gradient's
 * `var(--color-accent)` / `var(--color-accent-light)`, and the focus halo's
 * `var(--border-accent)`), plus the design-sanctioned `bg-white` keyword for the
 * pure-#FFFFFF knob (matching the sibling `Toggle`). There are NO raw hex / rgba
 * color literals. The only bare literals are LAYOUT / geometry values that carry
 * no color information — the track thickness (`h-1.5` = 6px), the knob footprint
 * (`h-5 w-5` = 20px), the gap (`gap-4`), the centering transform, and the fill
 * width `calc(...)` (all permitted: `0`, percentages, and px lengths are layout).
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * A wrapper hosts a flexible TRACK LANE and (optionally) the value label. Inside
 * the lane, two `pointer-events-none`, `aria-hidden` overlay bars are painted —
 * the full-width UNFILLED base (`bg-card`) and, on top, the FILLED gradient bar
 * whose width is driven by the controlled value. A real `<input type="range">`
 * sits ON TOP with `appearance-none` and a TRANSPARENT native track (so the
 * overlay bars show through); its THUMB is styled (via `[&::-webkit-slider-thumb]`
 * / `[&::-moz-range-thumb]`) to BE the visible 20px white knob. Using the native
 * thumb as the knob gives perfect drag / hit-target fidelity and a clean console.
 *
 * Fill↔knob alignment: a native range thumb's CENTER travels from `radius` to
 * `width − radius` (it never overflows the track), so a naive `width: ratio%`
 * fill would diverge from the knob center at the extremes. The fill width is
 * therefore `calc(radius + ratio × (100% − diameter))`, which makes the fill's
 * right edge meet the knob CENTER across the ENTIRE range (the opaque knob then
 * caps the bar seamlessly). `ratio` is the controlled fraction (clamped 0–1).
 *
 * ACCESSIBILITY (UI3)
 * --------------------------------------------------------------------------
 * • Renders a semantic `<input type="range">` — natively focusable and keyboard-
 *   operable (Arrow/Home/End/PageUp/PageDown), and it exposes `role="slider"`
 *   with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` derived from
 *   `value` / `min` / `max` automatically (no manual ARIA needed).
 * • A token-backed keyboard-only halo (`:focus-visible` → `--border-accent`) is
 *   shown around the knob; the default UA outline is removed. Invisible at rest.
 * • The value `<output>` mirrors `aria-valuenow`, so it is marked `aria-hidden`
 *   to avoid a double announcement; the input owns the accessible value.
 * • Callers MUST supply an accessible NAME via `aria-label` / `aria-labelledby`
 *   (forwarded through `...rest`) or a `<label htmlFor>` bound to a forwarded
 *   `id` — e.g. `aria-label="Content margins"` for the App 06 margins slider.
 * • `disabled` uses the native attribute (removing it from the tab order and
 *   blocking input); a defensive guard in the handler is belt-and-braces.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * look_feel.py` (the Qt preferences whose numeric margin/spacing settings this
 * slider is the web analog of). Nothing is imported or translated from Python.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { ChangeEvent, InputHTMLAttributes, JSX } from 'react';

/**
 * The knob diameter and radius in CSS px (CONFIRMED Figma `8:101` = 20px circle).
 * Used both for the knob's `h-5 w-5` footprint and — as `KNOB_DIAMETER_PX` /
 * `KNOB_RADIUS_PX` — for the fill-width `calc(...)` so the filled bar's right
 * edge meets the knob CENTER across the whole range (see RENDERING MODEL).
 */
const KNOB_DIAMETER_PX = 20;
const KNOB_RADIUS_PX = KNOB_DIAMETER_PX / 2;

/**
 * Props for {@link Slider} — the exact AAP §0.3.3 contract.
 *
 * Extends the native `<input>` attribute set (so `id`, `name`, `aria-*`,
 * `style`, … are forwarded via `...rest`) EXCEPT the range-specific props
 * (`value`, `min`, `max`, `step`, `onChange`) and `type` (pinned to `"range"`)
 * and `children` (a void element), which are re-declared / fixed below with the
 * tighter, number-first signatures suited to this controlled primitive.
 */
export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'min' | 'max' | 'step' | 'onChange' | 'type' | 'children'
  > {
  /** The current (controlled) numeric value. Always rendered as-is. */
  value: number;
  /** The minimum selectable value (the left end of the track). */
  min: number;
  /** The maximum selectable value (the right end of the track). */
  max: number;
  /**
   * The granularity of each step (drag snap + arrow-key increment).
   * @default 1
   */
  step?: number;
  /**
   * Called on every change with the new numeric value (already unwrapped from
   * the event via `Number(...)`, so callers can bind `onChange={setValue}`
   * directly). Optional so the control can be rendered display-only. Never fires
   * while {@link SliderProps.disabled} is `true`.
   */
  onChange?: (value: number) => void;
  /**
   * When `true`, renders the current numeric value (in the light-violet
   * `--color-accent-light` token) inline to the right of the track. The unit,
   * if any, is composed by the caller (the primitive renders the bare number).
   * @default false
   */
  showValue?: boolean;
  /**
   * When `true`, dims the whole control (`opacity-50`), shows a not-allowed
   * cursor, removes the input from the tab order, and suppresses `onChange`
   * (both natively via the `disabled` attribute and defensively in the handler).
   * @default false
   */
  disabled?: boolean;
  /**
   * Extra classes merged onto the WRAPPER — callers own the control's outer
   * width / layout here (e.g. `max-w-[446px]`, `w-[400px]`, or a sized parent).
   */
  className?: string;
}

/**
 * Outer wrapper classes: a full-width flex row so the track lane and the
 * optional value label sit centered side by side with a 16px gap (CONFIRMED
 * Figma ~16px gap between the track's right cap and the "32 px" value). The
 * `opacity-50` dim and the caller `className` are appended in {@link Slider}.
 */
const WRAPPER_BASE = 'flex w-full items-center gap-u16';

/**
 * Track-lane classes — the `relative` containing block for the two overlay bars
 * and the native input. `h-5` (20px) gives the 20px knob full vertical room;
 * `flex-1 min-w-0` lets the track grow to fill the wrapper while still being
 * able to shrink (no horizontal overflow, AAP responsive gate).
 */
const TRACK_LANE = 'relative h-u20 flex-1 min-w-0';

/**
 * UNFILLED base bar — the full-width 6px pill behind everything. `bg-card`
 * (#181C3C, CONFIRMED Figma `8:99`). `pointer-events-none` lets clicks fall
 * through to the input; `aria-hidden` keeps it out of the a11y tree. Centered
 * vertically in the 20px lane via `top-1/2 -translate-y-1/2`.
 */
const TRACK_UNFILLED =
  'pointer-events-none absolute inset-x-0 top-1/2 h-u6 -translate-y-1/2 rounded-full bg-card';

/**
 * FILLED bar — the purple progress portion, painted over the unfilled base.
 * Width is set inline (dynamic geometry; see {@link Slider}). The fill is the
 * VERTICAL accent gradient — the named `--gradient-slider-track` token
 * (`var(--color-accent)` bottom → `var(--color-accent-light)` top, `to top` =
 * 0deg), consumed via the ergonomic `bg-gradient-slider-track` utility declared
 * in globals.css. CONFIRMED Figma `8:100`; ZERO inline gradient literal (the
 * gradient definition lives in the token manifest, not here).
 */
const TRACK_FILLED =
  'pointer-events-none absolute left-0 top-1/2 h-u6 -translate-y-1/2 rounded-full ' +
  'bg-gradient-slider-track';

/**
 * Native `<input type="range">` classes — the single token-backed control.
 *
 * - Box: `block w-full h-5` fills the lane and matches the 20px knob height;
 *   `m-0` resets the UA range margin; `appearance-none` removes the native
 *   widget so the custom overlay + thumb are the only visuals; `bg-transparent`
 *   lets the overlay bars show through; `cursor-pointer` signals interactivity.
 * - Native TRACK (both engines) → height matched to the input and transparent,
 *   so the browser's own track never paints over the overlay bars.
 * - THUMB (both engines) → the visible KNOB: `appearance-none` (webkit), a 20px
 *   `h-5 w-5 rounded-full` circle, `border-0` (drops Firefox's default thumb
 *   border), `bg-white` (the sanctioned pure-#FFFFFF keyword). No resting shadow
 *   (Figma defines none — DS2-d).
 * - Focus: a token-backed `:focus-visible` halo on the thumb
 *   (`shadow-[0_0_0_var(--ring-focus-width)_var(--border-accent)]` — both the
 *   3px width and the color resolve to named tokens), shown for keyboard users
 *   only (UI3) and invisible at rest (DS2-e); the default UA outline is removed.
 * - Disabled: not-allowed cursor (paired with the native `disabled` attr; the
 *   wrapper carries the `opacity-50` dim so the bars + value label dim too).
 */
const INPUT_CLASSES =
  'relative m-0 block h-u20 w-full cursor-pointer appearance-none bg-transparent outline-none ' +
  'disabled:cursor-not-allowed ' +
  // WebKit / Blink (the prototype's Chromium target)
  '[&::-webkit-slider-runnable-track]:h-u20 [&::-webkit-slider-runnable-track]:bg-transparent ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-u20 [&::-webkit-slider-thumb]:w-u20 ' +
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-white ' +
  // Firefox / Gecko
  '[&::-moz-range-track]:h-u20 [&::-moz-range-track]:bg-transparent ' +
  '[&::-moz-range-thumb]:h-u20 [&::-moz-range-thumb]:w-u20 [&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white ' +
  // Keyboard-only focus halo on the knob (token-sourced width + color; invisible at rest)
  '[&:focus-visible::-webkit-slider-thumb]:shadow-[0_0_0_var(--ring-focus-width)_var(--border-accent)] ' +
  '[&:focus-visible::-moz-range-thumb]:shadow-[0_0_0_var(--ring-focus-width)_var(--border-accent)]';

/**
 * Value-label classes (CONFIRMED Figma `8:102`): the light-violet
 * `text-accent-light` (#A78BFA) in the `text-button-secondary` role — the design
 * system's Inter Medium 500 / 11px token, an EXACT match for Figma's value text
 * (style `FH2HSH`, 11px/500). The `meta-value` role would render 10px (1px under
 * Figma); `text-button-secondary` is the nearest 11px/500 role, so the readout is
 * pixel-exact and still 100% token-backed (see BLITZY [TYPOGRAPHY] in the header).
 * `shrink-0` keeps it from being squeezed by the flexible track; `tabular-nums`
 * stops the number from reflowing as digits change; `select-none` avoids
 * accidental selection.
 */
const VALUE_CLASSES =
  'shrink-0 select-none tabular-nums text-button-secondary text-accent-light';

/**
 * Clamp `n` to the inclusive `[0, 1]` range, mapping any non-finite input to 0.
 * Used to bound the fill fraction so an out-of-range or NaN `value` can never
 * produce a negative or overflowing filled bar.
 */
function clamp01(n: number): number {
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.min(Math.max(n, 0), 1);
}

/**
 * Slider — the bespoke design-system horizontal range-control primitive.
 *
 * Renders a flex wrapper holding a flexible track lane (a `bg-card` unfilled
 * pill, the vertical-accent-gradient filled bar whose width tracks `value`, and
 * a CONTROLLED native `<input type="range">` whose styled white thumb is the
 * visible 20px knob) and, when `showValue` is set, the current number in the
 * light-violet accent token inline to the right. Dragging the knob or pressing
 * the arrow keys calls `onChange(Number(...))` (never while `disabled`).
 *
 * The caller `className` is merged onto the wrapper (callers own outer width /
 * layout) and all remaining native input attributes are spread via `...rest`,
 * with `type` / `min` / `max` / `step` / `value` / `onChange` / `disabled`
 * applied AFTER the spread so they always take effect.
 *
 * @param props - {@link SliderProps}
 * @returns The rendered range control (optionally with an inline value label).
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  showValue = false,
  disabled = false,
  className,
  ...rest
}: SliderProps): JSX.Element {
  // Controlled fraction (0–1) of the value within [min, max], clamped so an
  // out-of-range or degenerate (max <= min) input cannot break the fill.
  const span = max - min;
  const ratio = clamp01(span > 0 ? (value - min) / span : 0);

  // Fill width: meet the knob CENTER across the whole range. A native thumb's
  // center travels from `radius` to `width − radius`, so map the fraction over
  // `(100% − diameter)` and offset by `radius` (dynamic geometry; no color).
  const fillStyle = {
    width: `calc(${KNOB_RADIUS_PX}px + ${ratio} * (100% - ${KNOB_DIAMETER_PX}px))`,
  };

  // Compose the wrapper classes: base + the disabled dim + caller className
  // (last so caller utilities win). `filter(Boolean)` drops empties so the
  // join never leaves a stray double space.
  const wrapperClassName = [WRAPPER_BASE, disabled ? 'opacity-50' : '', className]
    .filter(Boolean)
    .join(' ');

  // Controlled-change adapter: hand the caller the numeric value (not the raw
  // event), so screen code binds `onChange={setValue}` directly. The native
  // `disabled` attribute already blocks input; the guard is belt-and-braces.
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (disabled) {
      return;
    }
    onChange?.(Number(event.target.value));
  };

  return (
    <div className={wrapperClassName}>
      <div className={TRACK_LANE}>
        {/* Decorative overlay bars — the input owns the value/state, so both
            are hidden from assistive tech and ignore pointer events. */}
        <span aria-hidden="true" className={TRACK_UNFILLED} />
        <span aria-hidden="true" className={TRACK_FILLED} style={fillStyle} />
        <input
          {...rest}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={INPUT_CLASSES}
        />
      </div>
      {showValue ? (
        <output aria-hidden="true" className={VALUE_CLASSES}>
          {value}
        </output>
      ) : null}
    </div>
  );
}

export default Slider;
