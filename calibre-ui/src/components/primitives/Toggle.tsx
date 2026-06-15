'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Toggle
 * The single iOS-style on/off SWITCH primitive.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Toggle` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE pill-shaped on/off switch used everywhere a raw checkbox would
 * otherwise appear — most authoritatively the 2×3 "Reading Behavior" toggle
 * grid in Preferences (App 06, Figma screen `8:2`). Screen code must NEVER
 * render a raw `<input type="checkbox">`; it always composes this primitive so
 * the track, knob, animation, focus ring, and on/off colors stay identical and
 * 100% token-backed across every screen.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, interactive `<button>` that owns its
 * `aria-checked` state and reports every flip through `onChange`, and it calls
 * the `useId` hook to wire the optional visible label to the switch. Both make
 * it a Client Component (App Router components default to Server Components,
 * which cannot bind event handlers or run hooks). The directive is the very
 * first line of the file, before any import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * The canonical iOS pill switch was reconciled via analyze_figma_node against
 * the Preferences "Reading Behavior" grid (App 06, screen `8:2`) — the ONLY
 * screen that contains a true pill-track + sliding-knob switch — with deep
 * confirmatory calls on an ON instance (track `8:53` / knob `8:54`) and an OFF
 * instance (track `8:63` / knob `8:64`). CONFIRMED values:
 *   • TRACK → 44×24 px, radius 12px (= half the height → a full pill), NO
 *     stroke (the 1px white-7% hairline seen in the design belongs to the
 *     surrounding card, not the track).
 *       – ON  fill = linear-gradient(-45deg, #7B61FF 0% → #A78BFA 100%) — this
 *         is EXACTLY the `--gradient-accent` token, consumed via the
 *         `bg-gradient-accent` utility (declared in globals.css).
 *       – OFF fill = SOLID #181C3C (fully opaque) — EXACTLY the `--color-card`
 *         token, consumed via the `bg-card` utility.
 *   • KNOB → 18×18 px, radius 9px (full circle), pure #FFFFFF, NO drop shadow
 *     (Figma defines no effect on the knob node). OFF seated at x=4 (4px left
 *     inset); ON seated at x=22 (4px right inset); 3px top/bottom inset.
 *     Horizontal travel = 18px.
 * Both ON and OFF states are rendered (data-state completeness, FG2 / DS5-f).
 *
 * APP 05 RECONCILIATION NOTE (why this matches App 06, not App 05)
 * --------------------------------------------------------------------------
 * The agent brief named the Convert dialog's Look & Feel panel (App 05, `6:9`)
 * as a Toggle consumer. analyze_figma_node on `6:9` CONFIRMED that App 05 has
 * NO iOS pill switch: its "processing options" controls are 18×18 circular
 * status DOTS (gradient fill = ON, rgba(255,255,255,0.1) = OFF; no knob, no
 * travel) and its "justification toggle" is a 3-button SEGMENTED control
 * (Left / Justify / Right). Those are distinct controls composed by their own
 * screen components — they are NOT this pill switch. This primitive therefore
 * faithfully reproduces the App 06 iOS switch, which is the canonical
 * "Toggle: iOS switch" of AAP §0.3.3.
 *
 * BLITZY [COLOR] (on-track): the agent brief's "Key insight" hypothesized the
 * ON track as a FLAT `bg-accent` (#7B61FF). The CONFIRMED Figma fill on the
 * actual switch node (`8:53`) is the accent GRADIENT #7B61FF→#A78BFA. Per the
 * CRITICAL Precedence Directive (exact Figma values override directive defaults
 * — a default that masks what Figma shows is a hallucination) and the house
 * pattern set by the sibling `Select` (implement CONFIRMED Figma, flag the
 * deviation), this primitive uses `bg-gradient-accent`. The AAP §0.3.3 intent
 * ("purple #7B61FF track when on") is preserved exactly — #7B61FF is the
 * gradient's 0% stop. If a flat-accent track is ever mandated, swap the one
 * `TRACK_ON` constant to `bg-accent`.
 *
 * BLITZY [COLOR] (off-track): the brief hypothesized the OFF track as
 * `bg-[var(--border-white-09)]` or `bg-surface-2` ("confirm via Figma — a
 * dark/neutral track"). The CONFIRMED Figma fill (`8:63`) is the SOLID
 * `--color-card` (#181C3C), so this primitive uses `bg-card`.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR value resolves to an `@theme` token from `src/app/globals.css`,
 * consumed via a Tailwind v4 utility (`bg-gradient-accent`, `bg-card`,
 * `text-body`, `text-text-secondary`) or a CSS-variable arbitrary value
 * (`focus-visible:ring-[var(--border-accent)]`), plus the design-sanctioned
 * `bg-white` keyword for the pure-#FFFFFF knob. There are NO raw hex / rgba
 * color literals in any className. The only bare literals are LAYOUT / geometry
 * values that carry no color information — the switch footprint (`h-6`, `w-11`),
 * the knob size & placement (`h-[18px]`, `w-[18px]`, `top-[3px]`, `left-[4px]`,
 * `translate-x-[18px]`), the gap (`gap-2`), and the allowed transition
 * timings — all permitted.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * An outer inline-flex `<span>` hosts the switch and (optionally) its label;
 * the caller `className` is merged onto this WRAPPER (so callers own the
 * control's outer layout / margins), mirroring the sibling `Select`. The switch
 * itself is a single `<button type="button" role="switch">` (the track) that
 * contains one absolutely-positioned `<span>` (the knob). The knob slides via a
 * `translate-x` transform; the track color flips by swapping one class. Both
 * transitions are gated behind `motion-safe:` so reduced-motion users see an
 * instant state change (UI6 / prefers-reduced-motion).
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Renders a semantic `<button role="switch" aria-checked={checked}>` — a
 *   native button is focusable and toggles on BOTH Space and Enter for free,
 *   so no custom key handling is needed.
 * • When `label` is supplied it is rendered as visible text and wired to the
 *   switch as its accessible name via `aria-labelledby` (a `useId`-generated
 *   id) — the gold-standard "associate the visible label" pattern (no hidden
 *   duplicate text).
 * • The knob is decorative and marked `aria-hidden`; the switch owns the state.
 * • A token-backed `:focus-visible` ring (`--border-accent`) is shown for
 *   keyboard users only — invisible at rest (DS2-e).
 * • `disabled` uses the native attribute, which removes the control from the
 *   tab order and blocks clicks; a defensive guard in the handler is belt-and-
 *   braces.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/preferences/
 * look_feel.py` and `behavior.py` (the Qt preferences whose boolean settings
 * this switch is the web analog of). Nothing is imported or translated from the
 * Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useId, type JSX } from 'react';

/**
 * Props for {@link Toggle} — the exact AAP §0.3.3 contract.
 *
 * Intentionally a CLOSED interface (it does NOT extend the native `<button>`
 * attribute set): the switch's accessible name comes from the {@link label}
 * prop, and its only other inputs are the controlled state, the change handler,
 * the disabled flag, and an outer-wrapper `className`.
 */
export interface ToggleProps {
  /**
   * The current (controlled) on/off state.
   *   • `true`  → accent-gradient track, knob seated RIGHT.
   *   • `false` → solid `--color-card` track, knob seated LEFT.
   */
  checked: boolean;
  /**
   * Called on every flip with the NEXT state (`!checked`, already computed, so
   * callers can bind `onChange={setValue}` directly). Optional so the switch
   * can be rendered display-only. Never fires while {@link ToggleProps.disabled}
   * is `true`.
   */
  onChange?: (checked: boolean) => void;
  /**
   * When `true`, dims the switch (`opacity-50`), shows a not-allowed cursor,
   * removes it from the tab order, and suppresses `onChange` (both natively via
   * the `disabled` attribute and defensively via the click guard).
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional adjacent label. When present it is rendered as visible text beside
   * the switch (`text-body` / `text-text-secondary`) AND wired as the switch's
   * accessible name via `aria-labelledby`. Omit it when the switch sits inside
   * a separately-labeled row (e.g. an App 06 setting card that renders its own
   * title + description).
   */
  label?: string;
  /**
   * Extra classes merged onto the outer WRAPPER `<span>` — callers own the
   * control's outer layout / spacing here (e.g. `ms-auto`, `self-center`).
   */
  className?: string;
}

/**
 * Outer wrapper classes: an inline flex row so the switch and the optional
 * label sit centered side by side with an 8px gap. The caller `className` is
 * appended after this base (so caller utilities win on conflicts).
 */
const WRAPPER_BASE = 'inline-flex items-center gap-2';

/**
 * Variant-invariant TRACK classes — the pill `<button>` itself.
 *
 * - Box: `relative` (anchors the absolutely-positioned knob) · `inline-flex` ·
 *   `h-6 w-11` (CONFIRMED 24×44 px) · `shrink-0` (never collapses in a flex
 *   row) · `rounded-full` (the 12px-on-24px pill) · `cursor-pointer`.
 * - Focus: a token-backed `:focus-visible` ring (`--border-accent`), shown for
 *   keyboard users only (UI3) and invisible at rest (DS2-e); the default UA
 *   outline is removed (`outline-none`).
 * - Disabled: dim + not-allowed cursor (paired with the native `disabled` attr).
 * - Motion: the track color change animates only when motion is allowed (UI6).
 */
const TRACK_BASE =
  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * ON-state track fill: the ACCENT gradient (`--gradient-accent`,
 * #7B61FF→#A78BFA) via the ergonomic `bg-gradient-accent` utility. CONFIRMED
 * Figma fill of switch node `8:53` (see BLITZY [COLOR] in the file header).
 */
const TRACK_ON = 'bg-gradient-accent';

/**
 * OFF-state track fill: the solid `--color-card` (#181C3C) via `bg-card`.
 * CONFIRMED Figma fill of switch node `8:63` (see BLITZY [COLOR] in the header).
 */
const TRACK_OFF = 'bg-card';

/**
 * Variant-invariant KNOB classes — the sliding white thumb.
 *
 * `pointer-events-none` lets every click fall through to the track button.
 * `absolute left-[4px] top-[3px]` seats the OFF knob at the CONFIRMED (4,3);
 * `h-[18px] w-[18px] rounded-full` is the 18px circle; `bg-white` is the
 * sanctioned keyword for the pure-#FFFFFF thumb. The slide animates only when
 * motion is allowed (UI6).
 */
const KNOB_BASE =
  'pointer-events-none absolute left-[4px] top-[3px] h-[18px] w-[18px] rounded-full bg-white ' +
  'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out';

/**
 * Knob horizontal placement by state. OFF stays at the base `left-[4px]`
 * (translateX 0 → x=4); ON shifts right by the CONFIRMED 18px travel
 * (4 + 18 = x=22), seating the knob at the 4px right inset.
 */
const KNOB_ON = 'translate-x-[18px]';
const KNOB_OFF = 'translate-x-0';

/**
 * Optional-label typography (AAP §0.3.3 contract for this primitive's `label`):
 * the `text-body` role (12px) in the secondary text token (#94A3B8).
 * `select-none` keeps the label from being text-selected on rapid toggling.
 */
const LABEL_CLASSES = 'select-none text-body text-text-secondary';

/**
 * Toggle — the bespoke design-system iOS-style on/off switch primitive.
 *
 * Renders an inline-flex wrapper containing a single `<button type="button"
 * role="switch" aria-checked>` (the pill track) with one absolutely-positioned
 * knob `<span>` inside it, plus an optional adjacent label. Flipping the switch
 * calls `onChange(!checked)` (never while `disabled`); the knob slides via a
 * `translate-x` transform and the track color swaps between the accent gradient
 * (on) and the card surface (off). When `label` is provided it is rendered as
 * visible text and wired to the switch as its accessible name via
 * `aria-labelledby`.
 *
 * @param props - {@link ToggleProps}
 * @returns The rendered switch (optionally with an adjacent label).
 */
export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  className,
}: ToggleProps): JSX.Element {
  // A stable, SSR-safe unique id (React 19 `useId`) used to associate the
  // visible label with the switch via `aria-labelledby`. Called unconditionally
  // to honor the Rules of Hooks; only referenced when a label is present.
  const labelId = useId();
  const hasLabel = label != null && label !== '';

  // Defensive flip guard. The native `disabled` attribute already suppresses
  // clicks, but short-circuiting here guarantees the handler can never run while
  // disabled and reports the NEXT state so callers bind `onChange={setValue}`.
  const handleToggle = (): void => {
    if (disabled) {
      return;
    }
    onChange?.(!checked);
  };

  // Compose token-backed class strings: base + the active state's class. The
  // caller className is merged onto the WRAPPER (last) so its utilities win.
  const trackClassName = `${TRACK_BASE} ${checked ? TRACK_ON : TRACK_OFF}`;
  const knobClassName = `${KNOB_BASE} ${checked ? KNOB_ON : KNOB_OFF}`;
  const wrapperClassName = [WRAPPER_BASE, className].filter(Boolean).join(' ');

  return (
    <span className={wrapperClassName}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={hasLabel ? labelId : undefined}
        disabled={disabled}
        onClick={handleToggle}
        className={trackClassName}
      >
        {/* Decorative sliding thumb — the switch button owns the state, so the
            knob is hidden from assistive tech. */}
        <span aria-hidden="true" className={knobClassName} />
      </button>
      {hasLabel ? (
        <span id={labelId} className={LABEL_CLASSES}>
          {label}
        </span>
      ) : null}
    </span>
  );
}

export default Toggle;
