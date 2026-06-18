'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Toggle
 * The single binary on/off control primitive — two presentations: iOS pill
 * SWITCH (default) and App-05 status DOT.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Toggle` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE binary on/off control used everywhere a raw checkbox would
 * otherwise appear. Screen code must NEVER render a raw `<input
 * type="checkbox">`; it always composes this primitive so the focus ring,
 * animation, and on/off colors stay identical and 100% token-backed.
 *
 * It renders in one of two visually-distinct PRESENTATIONS (`presentation`
 * prop) — both are the SAME semantic `<button role="switch" aria-checked>`:
 *   • `'switch'` (DEFAULT) — the iOS pill track + sliding knob. Used most
 *     authoritatively by the 2×3 "Reading Behavior" toggle grid in Preferences
 *     (App 06, Figma screen `8:2`) and the Convert justification row.
 *   • `'dot'` — an 18×18 circular STATUS DOT (accent-gradient fill = ON,
 *     rgba(255,255,255,0.10) = OFF; no knob, no travel). Used by the App 05
 *     Convert "processing options" 2×3 grid (Figma screen `6:9`).
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
 * APP 05 RECONCILIATION NOTE (the `'dot'` presentation, finding §LookAndFeel)
 * --------------------------------------------------------------------------
 * The agent brief named the Convert dialog's Look & Feel panel (App 05, `6:9`)
 * as a Toggle consumer. analyze_figma_node on `6:9` CONFIRMED that App 05's
 * "processing options" controls are NOT the iOS pill switch but 18×18 circular
 * status DOTS (accent-gradient fill = ON, rgba(255,255,255,0.10) = OFF; no
 * knob, no travel). Rather than fork a second primitive, those dots are the
 * `presentation="dot"` mode of THIS primitive (CP4 fidelity fix): the same
 * `<button role="switch" aria-checked>` semantics, the same `onChange`/focus
 * ring/disabled handling, only the rendered visual differs (a bare colored
 * circle instead of a track + knob — see `DOT_BASE` / `DOT_ON` / `DOT_OFF`
 * below). App 05's "justification toggle" is a 3-button SEGMENTED control
 * (Left / Justify / Right) in Figma; however AAP §0.3.1 / §0.7.4 explicitly
 * specify a binary "justification toggle", so per the D1 precedence order
 * (explicit AAP rule wins) the justification row stays a binary `Toggle`
 * (`presentation="switch"`) and the segmented variant is declined — documented
 * at its call site in `LookAndFeelPanel`. This primitive thus serves both the
 * canonical App 06 iOS switch ("Toggle: iOS switch", AAP §0.3.3) and the App 05
 * status dot from one source of truth.
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
 * color literals in any className. Geometry values also resolve to named
 * `@theme` tokens — the knob size & placement are consumed via arbitrary `var()`
 * utilities (`h-[var(--size-toggle-knob)]`, `w-[var(--size-toggle-knob)]`,
 * `top-[var(--space-toggle-knob-inset-y)]`, `left-[var(--space-toggle-knob-inset-x)]`,
 * `translate-x-[var(--space-toggle-knob-travel)]`). The only remaining bare
 * utilities are Tailwind's standard spacing scale (the switch footprint `h-6` /
 * `w-11`, the `gap-2` row gap) and the allowed transition timings.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * An outer inline-flex `<span>` hosts the control and (optionally) its label;
 * the caller `className` is merged onto this WRAPPER (so callers own the
 * control's outer layout / margins), mirroring the sibling `Select`. The
 * control itself is a single `<button type="button" role="switch">` whose
 * visual depends on `presentation`:
 *   • `'switch'` (default) — the button is the pill TRACK and contains one
 *     absolutely-positioned `<span>` knob; the knob slides via a `translate-x`
 *     transform and the track color flips by swapping one class.
 *   • `'dot'` — the button IS the 18px status circle (no inner knob child); its
 *     fill flips by swapping one class.
 * All transitions are gated behind `motion-safe:` so reduced-motion users see
 * an instant state change (UI6 / prefers-reduced-motion).
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Renders a semantic `<button role="switch" aria-checked={checked}>` — a
 *   native button is focusable and toggles on BOTH Space and Enter for free,
 *   so no custom key handling is needed.
 * • The switch ALWAYS exposes an accessible name, resolved in priority order:
 *   (1) a visible `label`, rendered as text and wired via `aria-labelledby`
 *   (a `useId`-generated id) — the gold-standard "associate the visible label"
 *   pattern (no hidden duplicate text); (2) else a caller `ariaLabelledby`
 *   pointing at a separately-rendered title (the App 06 "labeled row" case);
 *   (3) else a caller `ariaLabel` literal; (4) else a last-resort
 *   `aria-label="Toggle"` so `role="switch"` can never be anonymous to AT. Exactly
 *   one mechanism is emitted at a time (labelledby and label are never both set).
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
 * attribute set): the switch's accessible name comes from EITHER the visible
 * {@link ToggleProps.label} prop, OR — when the switch sits inside a
 * separately-labeled row — one of {@link ToggleProps.ariaLabelledby} /
 * {@link ToggleProps.ariaLabel}. Its other inputs are the controlled state, the
 * change handler, the disabled flag, and an outer-wrapper `className`. The switch
 * is NEVER rendered without an accessible name: a last-resort name is supplied if
 * a caller provides none, so `role="switch"` can never be anonymous to AT.
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
   * title + description) — in that case wire the name via {@link ToggleProps.ariaLabelledby}
   * or {@link ToggleProps.ariaLabel} instead.
   */
  label?: string;
  /**
   * Id of a SEPARATELY-rendered element that names this switch, mapped to the
   * `aria-labelledby` attribute. Use this (instead of {@link ToggleProps.label})
   * when the switch sits in a row that already renders its own visible title —
   * e.g. point it at an App 06 setting-card heading's id. Ignored when a visible
   * {@link ToggleProps.label} is supplied (the label's own id wins).
   */
  ariaLabelledby?: string;
  /**
   * Literal accessible name, mapped to the `aria-label` attribute. Use this when
   * the switch has NO visible label element to reference (no {@link ToggleProps.label}
   * and no {@link ToggleProps.ariaLabelledby}). If none of `label` /
   * `ariaLabelledby` / `ariaLabel` is provided, the switch still receives a
   * last-resort `aria-label` of `"Toggle"` so it is never unnamed.
   */
  ariaLabel?: string;
  /**
   * Which visual the control renders (CP4 Figma-fidelity fix per finding
   * §LookAndFeelPanel L359-363). BOTH presentations are the SAME semantic
   * `<button role="switch" aria-checked>` control (identical state, `onChange`,
   * keyboard, focus ring, and accessible-name handling) — only the visual marker
   * differs:
   *   • `'switch'` — the canonical iOS pill track + sliding knob (App 06
   *     "Reading Behavior" grid, `8:53`/`8:63`). The default.
   *   • `'dot'`    — a single 18×18 circular STATUS DOT (no track, no knob, no
   *     travel): accent-gradient fill when ON, `rgba(255,255,255,0.10)` when OFF.
   *     This is the CONFIRMED App 05 Convert "processing options" marker
   *     (`analyze_figma_node(6:9)`), used by `LookAndFeelPanel`'s 2×3 grid.
   * @default 'switch'
   */
  presentation?: 'switch' | 'dot';
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
 * `absolute left-[var(--space-toggle-knob-inset-x)] top-[var(--space-toggle-knob-inset-y)]`
 * seats the OFF knob at the CONFIRMED (4,3) via the named inset tokens;
 * `h-[var(--size-toggle-knob)] w-[var(--size-toggle-knob)] rounded-full` is the
 * 18px circle; `bg-white` is the sanctioned keyword for the pure-#FFFFFF thumb.
 * The slide animates only when motion is allowed (UI6).
 */
const KNOB_BASE =
  'pointer-events-none absolute left-[var(--space-toggle-knob-inset-x)] top-[var(--space-toggle-knob-inset-y)] ' +
  'h-[var(--size-toggle-knob)] w-[var(--size-toggle-knob)] rounded-full bg-white ' +
  'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out';

/**
 * Knob horizontal placement by state. OFF stays at the base inset (translateX 0
 * → x=4); ON shifts right by the CONFIRMED 18px travel
 * (`--space-toggle-knob-travel`; 4 + 18 = x=22), seating the knob at the 4px
 * right inset.
 */
const KNOB_ON = 'translate-x-[var(--space-toggle-knob-travel)]';
const KNOB_OFF = 'translate-x-0';

/**
 * `'dot'` presentation — the App 05 Convert "processing options" status DOT
 * (CONFIRMED via `analyze_figma_node(6:9)`: an 18×18 circle, gradient fill = ON,
 * `rgba(255,255,255,0.10)` = OFF; no track, no knob, no travel). The control is
 * still a full `<button role="switch" aria-checked>` (same state/keyboard/focus
 * as the pill switch); only the visual marker changes.
 *
 * - Box: `relative inline-flex` · `h-[var(--size-toggle-knob)]
 *   w-[var(--size-toggle-knob)]` (the 18px `--size-toggle-knob` token, shared
 *   with the pill knob) · `shrink-0` (never collapses in a flex row) ·
 *   `rounded-full` (full circle) · `cursor-pointer`.
 * - Focus / disabled / motion: identical token-backed treatment to the pill
 *   track (a keyboard-only `:focus-visible` ring on `--border-accent`, the
 *   `disabled` dim, and a `motion-safe` color transition).
 */
const DOT_BASE =
  'relative inline-flex h-[var(--size-toggle-knob)] w-[var(--size-toggle-knob)] shrink-0 ' +
  'cursor-pointer rounded-full ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out';

/**
 * ON-state dot fill: the ACCENT gradient (`--gradient-accent`, #7B61FF→#A78BFA)
 * via `bg-gradient-accent` — the CONFIRMED Figma "gradient fill = ON" for the
 * App 05 processing dots (`6:9`); shares the pill switch's ON token.
 */
const DOT_ON = 'bg-gradient-accent';

/**
 * OFF-state dot fill: `rgba(255,255,255,0.10)` via the `--border-white-10` token
 * (`bg-[var(--border-white-10)]`) — the CONFIRMED Figma "rgba(255,255,255,0.1) =
 * OFF" for the App 05 processing dots (`6:9`).
 */
const DOT_OFF = 'bg-[var(--border-white-10)]';

/**
 * Optional-label typography (AAP §0.3.3 contract for this primitive's `label`):
 * the `text-body` role (12px) in the secondary text token (#94A3B8).
 * `select-none` keeps the label from being text-selected on rapid toggling.
 */
const LABEL_CLASSES = 'select-none text-body text-text-secondary';

/**
 * Toggle — the bespoke design-system binary on/off control primitive.
 *
 * Renders an inline-flex wrapper containing a single `<button type="button"
 * role="switch" aria-checked>`, plus an optional adjacent label. Flipping it
 * calls `onChange(!checked)` (never while `disabled`). The `presentation` prop
 * selects the visual: `'switch'` (default) renders the iOS pill track with an
 * absolutely-positioned knob `<span>` that slides via a `translate-x` transform
 * (track color swaps accent-gradient on / card surface off); `'dot'` renders the
 * 18px App-05 status circle with no inner knob (fill swaps accent-gradient on /
 * `--border-white-10` off). When `label` is provided it is rendered as visible
 * text and wired to the control as its accessible name via `aria-labelledby`.
 *
 * @param props - {@link ToggleProps}
 * @returns The rendered control (optionally with an adjacent label).
 */
export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  ariaLabelledby,
  ariaLabel,
  presentation = 'switch',
  className,
}: ToggleProps): JSX.Element {
  // A stable, SSR-safe unique id (React 19 `useId`) used to associate the
  // visible label with the switch via `aria-labelledby`. Called unconditionally
  // to honor the Rules of Hooks; only referenced when a label is present.
  const labelId = useId();
  const hasLabel = label != null && label !== '';
  const hasAriaLabelledby = ariaLabelledby != null && ariaLabelledby !== '';

  // Accessible-name resolution — the switch must NEVER be anonymous to AT.
  // Priority: visible label (wired by its own id) > caller `ariaLabelledby`
  // (points at a separately-rendered title) > caller `ariaLabel` > a last-resort
  // literal. Exactly ONE of aria-labelledby / aria-label is emitted: when a
  // labelledby source exists, aria-label stays undefined; otherwise an aria-label
  // is always present (caller-supplied or the "Toggle" fallback).
  const resolvedLabelledBy = hasLabel
    ? labelId
    : hasAriaLabelledby
      ? ariaLabelledby
      : undefined;
  const resolvedAriaLabel =
    resolvedLabelledBy == null ? (ariaLabel ?? 'Toggle') : undefined;

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
  // 'dot' presentation swaps the pill track for an 18px status dot (no knob);
  // 'switch' (default) renders the iOS pill track + sliding knob. The caller
  // className is merged onto the WRAPPER (last) so its utilities win.
  const isDot = presentation === 'dot';
  const controlClassName = isDot
    ? `${DOT_BASE} ${checked ? DOT_ON : DOT_OFF}`
    : `${TRACK_BASE} ${checked ? TRACK_ON : TRACK_OFF}`;
  const knobClassName = `${KNOB_BASE} ${checked ? KNOB_ON : KNOB_OFF}`;
  const wrapperClassName = [WRAPPER_BASE, className].filter(Boolean).join(' ');

  return (
    <span className={wrapperClassName}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={resolvedLabelledBy}
        aria-label={resolvedAriaLabel}
        disabled={disabled}
        onClick={handleToggle}
        className={controlClassName}
      >
        {/* Pill ('switch') only: the decorative sliding thumb — the button owns
            the state, so the knob is hidden from assistive tech. The 'dot'
            presentation is a bare colored circle (the button itself), so it
            renders no inner knob. */}
        {isDot ? null : <span aria-hidden="true" className={knobClassName} />}
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
