'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — Select
 * The single chevron dropdown / selection primitive.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `Select` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE controlled dropdown used everywhere a raw `<select>` would
 * otherwise appear:
 *   • CONVERT — the Convert Books dialog's input → output FORMAT dropdowns
 *     (App 05, Figma screen `6:9`; input `6:18`, output `6:22`). The OUTPUT
 *     dropdown is the design's only `active` Select — it is highlighted with the
 *     purple accent gradient (see ACTIVE STATE below).
 *   • PREFERENCES — the "Default Font" family dropdown of the Reading → Fonts
 *     settings panel (App 06, Figma screen `8:2`; dropdown `8:39`).
 * Screen code must NEVER render a raw `<select>`; it always composes this
 * primitive so the surface, border, radius, chevron, focus, and typography stay
 * identical and 100% token-backed across every screen.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, CONTROLLED `<select>` (its `value` is owned by
 * the caller and every selection is reported through `onChange`), so it must be
 * a Client Component — App Router components default to Server Components, which
 * cannot bind change handlers. The directive is the very first line, before any
 * import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the Convert format dropdowns
 * (input `6:18` DEFAULT, output `6:22` ACTIVE; parent screen `6:9`) and the
 * Preferences "Default Font" dropdown (`8:39`; parent screen `8:2`). Both the
 * Convert input dropdown and the Preferences font dropdown share ONE resting
 * look, so this primitive renders a single canonical DEFAULT field plus the
 * ACTIVE accent-gradient variant:
 *   • DEFAULT fill   → `#181C3C` (= `--color-card`, the "card" surface)
 *                      CONFIRMED on `6:18` AND `8:39` — NOT `#13162E` surface-2
 *                      (that is the modal / sidebar surface, not the dropdown).
 *   • DEFAULT border → `rgba(255,255,255,0.09)` 1px (= `--border-white-09`)
 *   • RADIUS         → `8px` (= `--radius-control`)  [both screens]
 *   • VALUE text     → `#F1F5FF` (= `--color-text-primary`, the near-white token)
 *                      CONFIRMED on `6:18`, `6:22`, AND `8:39` — NOT pure #FFFFFF.
 *   • DEFAULT chevron→ `#64748B` (= `--color-text-muted`)  [both screens]
 *   • TYPOGRAPHY     → `text-body` 12px size + per-state weight (DEFAULT 500 /
 *                      ACTIVE 600), matching Figma — see BLITZY [TYPOGRAPHY].
 *
 * ACTIVE STATE — EXACT FIGMA VALUES (BLITZY [COLOR] · Figma precedence)
 * --------------------------------------------------------------------------
 * The agent brief described the active OUTPUT dropdown as the "accent gradient"
 * (`--gradient-accent`, #7B61FF→#A78BFA), white text, and an accent border.
 * analyze_figma_node on the ACTUAL active node (`6:22`) — plus a confirmatory
 * get_figma_data on its fill — CONFIRMED three exact values that DIFFER from
 * that hypothesis, and the subagent flagged the gradient explicitly ("Use
 * #7B61FF→#4838C8 for the active Select, not #7B61FF→#A78BFA"):
 *   1. FILL is `--gradient-cta` = `linear-gradient(-45deg, #7B61FF 0%, #4838C8
 *      100%)`, NOT `--gradient-accent` (whose 2nd stop is the lighter #A78BFA).
 *      `6:22` uses the SAME token as the "Convert Book" CTA (`6:100`).
 *   2. There is NO stroke on the active dropdown — neither white-09 nor an
 *      accent border. Realized as `border-transparent` so the 1px border-box
 *      reservation (and therefore the geometry) stays identical to the default
 *      state while showing no visible border.
 *   3. VALUE text stays `#F1F5FF` (= `--color-text-primary`), NOT pure #FFFFFF —
 *      identical to the default value color and matching the sibling `Button`
 *      primary, which likewise renders #F1F5FF rather than `text-white`.
 * The ACTIVE chevron is `#A78BFA` (= `--color-accent-light`), brighter than the
 * muted default chevron so it reads on the gradient. Per the CRITICAL Precedence
 * Directive (Figma overrides AAP directives on exact values) and the brief's own
 * rule ("subagent reinforces exact values"), this primitive implements the
 * CONFIRMED Figma values; intent (an accent-gradient-highlighted active output
 * dropdown) is preserved exactly. Both DEFAULT and ACTIVE states are rendered
 * (data-state completeness, FG2 / DS5-f).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`bg-card`,
 * `bg-gradient-cta`, `rounded-control`, `text-text-primary`,
 * `text-text-placeholder`, `text-text-muted`, `text-accent-light`, `bg-surface-2`,
 * `text-body`) or a CSS-variable arbitrary value
 * (`border-[var(--border-white-09)]`, `focus-visible:ring-[var(--border-accent)]`).
 * The active fill uses the ergonomic `bg-gradient-cta` utility (defined in
 * globals.css), which is identical in output to the arbitrary
 * `bg-[image:var(--gradient-cta)]` form and is the house-preferred spelling
 * (cf. sibling `Button`). There are NO raw hex / rgba color literals. The only
 * bare literals are LAYOUT / appearance values that carry no color information —
 * paddings (`ps-3`, `pe-8`, `py-2`, `pe-4`), `w-full`, the `appearance-none`
 * native-arrow reset, `border-transparent`, and the allowed keywords — all
 * permitted.
 *
 * BLITZY [TYPOGRAPHY]: Figma renders the dropdown VALUE text at Inter Medium 500
 * in the DEFAULT state (`6:18`/`6:19` Convert input + `8:39`/`8:40` Preferences
 * "Georgia") and at Inter Semi Bold 600 in the ACTIVE state (`6:22`/`6:23`
 * Convert output), sized 12px (Convert) / 13px (Preferences). Per the CRITICAL
 * Precedence Directive (Figma EXACT values override directive defaults) and DS4
 * weight-snapping (snap to the nearest SYSTEM weight — 500 and 600 are both
 * system weights), this primitive matches Figma's per-state WEIGHT exactly:
 * the DEFAULT value text is `font-medium` (500, = `--font-weight-medium`) and the
 * ACTIVE value text is `font-semibold` (600, = `--text-button-primary--font-weight`).
 * The SIZE stays on the one `text-body` (12px) token per the agent contract's
 * explicit "`text-body`" instruction: 12px is exact for Convert and a DS4 ±1px
 * SILENT snap of Preferences' 13px. The agent brief's parenthetical "Inter 400"
 * described the `text-body` token's nominal weight; Figma reconciliation (and the
 * post-build `compare_screenshot_with_figma` pass on `6:9` + `8:2`, which both
 * recommended restoring the per-state weight) established the actual 500/600
 * weights now implemented. The font-weight utilities are token-backed (no raw
 * literals) and audit-clean.
 *
 * CHEVRON IS A GLYPH, NOT AN ASSET (AAP §0.3.4)
 * --------------------------------------------------------------------------
 * The disclosure indicator is the Unicode character "▾" (U+25BE BLACK DOWN-
 * POINTING SMALL TRIANGLE) — the exact glyph Figma uses on the Convert
 * dropdowns (`6:20` / `6:24`). (Preferences `8:41` uses a literal "v"; per the
 * agent contract this primitive standardizes on the cleaner ▾.) No image / SVG
 * asset exists or is created — both Figma analyses confirmed ZERO binary assets
 * in the dropdown subtree. The native `<select>`'s own arrow is removed with
 * `appearance-none`, and the ▾ is rendered as a trailing, absolutely-positioned,
 * `aria-hidden` glyph (the select reserves inline-end padding, `pe-8`, to clear
 * it). `pointer-events-none` lets clicks fall through to the select.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * A `relative` wrapper `<div>` hosts the `<select>` and the trailing ▾ glyph.
 * The caller `className` is merged onto the WRAPPER (so callers own the
 * control's width / layout, e.g. `w-[360px]` for the Convert dropdowns or
 * `w-[280px]` for the Preferences font dropdown) while the select is `w-full`
 * and carries the token-backed visuals. `options` accepts either
 * `SelectOption[]` ({label,value}) or a bare `string[]`, normalized internally.
 * An optional `placeholder` renders a leading, disabled+hidden empty `<option>`
 * shown only while the value is empty (its closed-display text uses the muted
 * `--color-text-placeholder`). Each real `<option>` is themed `bg-surface-2`
 * `text-text-primary` so the native popup list stays dark-navy and legible. All
 * remaining native `<select>` attributes (`id`, `name`, `aria-*`, `style`, …)
 * are forwarded via `...rest`; the explicit `value` / `onChange` / `disabled` /
 * `className` are applied AFTER the spread so they always win. The control is
 * fully CONTROLLED: it renders `value` and reports edits through
 * `onChange(nextValue)` (the raw string, not the event), so React never warns
 * about a controlled select without an `onChange`.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Renders a semantic `<select>` — natively focusable, keyboard-operable, and
 *   screen-reader friendly (arrow keys / type-ahead, no custom ARIA needed).
 * • The ▾ glyph is `aria-hidden` (the select owns the accessible name).
 * • A token-backed `:focus-visible` ring (the `--border-accent` token) is shown
 *   for keyboard users only (UI3) — invisible at rest (DS2-e).
 * • The `<select>` ALWAYS carries an `id` and a `name`: a caller-supplied value
 *   wins, otherwise a stable `useId()` identifier is generated (and the `name`
 *   falls back to that `id`). This keeps every dropdown free of the Chrome /
 *   Lighthouse "form field should have an id or name" finding without the caller
 *   having to remember — see the {@link Select} body.
 * • Callers MUST supply an accessible name via a `<label htmlFor>` bound to the
 *   forwarded `id`, or an `aria-label` / `aria-labelledby` (forwarded via
 *   `...rest`) — e.g. `aria-label="Output format"` for the Convert output
 *   dropdown.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/convert/`
 * (the Qt conversion dialog whose format selectors this models) and
 * `src/calibre/gui2/preferences/look_feel.py`. Nothing is imported or translated
 * from the Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useId, type ChangeEvent, type JSX, type SelectHTMLAttributes } from 'react';

/**
 * A single dropdown choice: the human-readable `label` shown in the list and on
 * the closed control, plus the underlying `value` reported through
 * {@link SelectProps.onChange}.
 *
 * Callers may instead pass a bare `string` per option (see
 * {@link SelectProps.options}); such strings are normalized to
 * `{ label: s, value: s }` internally, so this shape is the canonical form.
 */
export interface SelectOption {
  /** Human-readable text shown in the option list and on the closed control. */
  label: string;
  /** The underlying value submitted via {@link SelectProps.onChange}. */
  value: string;
}

/**
 * Props for {@link Select}.
 *
 * Extends the native `<select>` attribute set (so `id`, `name`, `aria-*`,
 * `style`, `autoComplete`, `required`, … are all forwarded via `...rest`)
 * EXCEPT `value` and `onChange`, which are re-declared below with the tighter,
 * value-first signatures suited to this controlled primitive.
 */
export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  /** The current (controlled) selected value. Always rendered as-is. */
  value: string;
  /**
   * The selectable choices. Accepts either fully-formed {@link SelectOption}
   * objects (`{ label, value }`) OR bare `string`s (each normalized to
   * `{ label: s, value: s }`). A `readonly` array is accepted so callers can
   * pass `as const` literal lists without a type error.
   */
  options: ReadonlyArray<SelectOption | string>;
  /**
   * Called on every selection with the chosen option's `value` (already
   * unwrapped from the change event, so callers can bind `onChange={setValue}`
   * directly). Optional so the control can be rendered display-only.
   */
  onChange?: (value: string) => void;
  /**
   * When `true`, the control is highlighted with the purple accent gradient —
   * the Convert dialog's active OUTPUT format dropdown (Figma `6:22`). Renders
   * `--gradient-cta` fill, a transparent border (no visible stroke, per Figma),
   * near-white value text, and a light-violet chevron. See the file header's
   * ACTIVE STATE note for the exact reconciled values.
   * @default false
   */
  active?: boolean;
  /**
   * Optional placeholder shown (in the muted `--color-text-placeholder` token)
   * while {@link SelectProps.value} is empty. Implemented as a leading,
   * `disabled` + `hidden` empty `<option>`.
   */
  placeholder?: string;
  /**
   * When `true`, dims the control (`opacity-50`), shows a not-allowed cursor,
   * and blocks interaction via the native `disabled` attribute (which also
   * suppresses `onChange`).
   * @default false
   */
  disabled?: boolean;
  /**
   * Extra classes merged onto the WRAPPER `<div>` — callers own the control's
   * width / layout here (e.g. `w-[360px]`, `w-[280px]`, or `w-full`).
   */
  className?: string;
}

/**
 * Normalize a single option entry to the canonical {@link SelectOption} shape.
 * A bare `string` becomes `{ label: s, value: s }`; an existing object is
 * returned unchanged. Keeps the render path uniform regardless of input form.
 */
function normalizeOption(option: SelectOption | string): SelectOption {
  return typeof option === 'string' ? { label: option, value: option } : option;
}

/**
 * The Unicode disclosure glyph rendered as the dropdown chevron — "▾"
 * (U+25BE BLACK DOWN-POINTING SMALL TRIANGLE), the exact character Figma uses on
 * the Convert format dropdowns (`6:20` / `6:24`). It is a TEXT glyph, never an
 * asset (AAP §0.3.4).
 */
const CHEVRON_GLYPH = '\u25BE';

/**
 * Variant-invariant `<select>` classes — the single canonical, token-backed
 * control surface shared by both the default and active states.
 *
 * - Box: `block w-full` fills the wrapper (callers size the wrapper); the native
 *   arrow is removed with `appearance-none` so the custom ▾ glyph is the only
 *   disclosure indicator. `cursor-pointer` signals interactivity.
 * - Shape / type: `rounded-control` (8px, CONFIRMED `6:18` / `6:22` / `8:39`) +
 *   the `text-body` (12px) size scale; the per-state value-text WEIGHT (DEFAULT
 *   `font-medium` 500 / ACTIVE `font-semibold` 600) is layered by {@link Select}
 *   to match Figma (see BLITZY [TYPOGRAPHY] in header).
 * - Padding: `ps-3` (12px) inline-start to the value (≈ Figma's 12–14px) +
 *   `pe-8` (32px) inline-end to reserve room for the trailing ▾ glyph + `py-2`
 *   vertical (the agent-contract `px-3 py-2`, expressed with logical properties
 *   per DS7). Width / exact height are caller-controlled via the wrapper
 *   `className`, mirroring the sibling `InputField`.
 * - Focus: a token-backed `:focus-visible` ring (`--border-accent`), shown for
 *   keyboard users only (UI3) and invisible at rest (DS2-e); the default UA
 *   outline is removed (`outline-none`).
 * - Disabled: dim + not-allowed cursor (paired with the native `disabled` attr).
 * - Motion: color changes animate only when motion is allowed (UI6).
 */
const BASE_SELECT_CLASSES =
  'block w-full appearance-none cursor-pointer ' +
  'rounded-control text-body ' +
  'ps-u12 pe-u32 py-u8 ' +
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'motion-safe:transition-colors';

/**
 * ACTIVE-state `<select>` classes (Figma `6:22`, the Convert output dropdown).
 * Accent-gradient fill via the ergonomic `bg-gradient-cta` token utility
 * (= `--gradient-cta`, #7B61FF→#4838C8 — see BLITZY [COLOR] in the header),
 * a TRANSPARENT border (no visible stroke, per Figma; keeps the 1px border-box
 * reservation so geometry matches the default state exactly), and near-white
 * `text-text-primary` (#F1F5FF) value text.
 *
 * The value text is `font-semibold` (600): Figma `6:23` renders the ACTIVE
 * output value at Inter Semi Bold 600 (deliberately heavier than the default's
 * Medium 500) to emphasize the selected output format. 600 is an exact system
 * weight (`--text-button-primary--font-weight`), so the weight matches Figma
 * precisely while the size stays on the `text-body` (12px) token. See the
 * BLITZY [TYPOGRAPHY] note in the file header.
 */
const ACTIVE_SELECT_CLASSES =
  'bg-gradient-cta border border-transparent text-text-primary font-semibold';

/**
 * DEFAULT-state `<select>` SURFACE classes (Figma `6:18` / `8:39`): the
 * `bg-card` (#181C3C) surface + a 1px `--border-white-09` hairline. The value
 * TEXT color is applied separately (see {@link Select}) so an empty field can
 * show the muted placeholder color instead.
 */
const DEFAULT_SURFACE_CLASSES =
  'bg-card border border-[var(--border-white-09)]';

/**
 * Trailing ▾ chevron wrapper classes (always rendered).
 *
 * Absolutely pinned to the inline-end and vertically centered over the select,
 * with an 18px inset (`pe-4.5` = calc(var(--spacing) × 4.5) = 1.125rem), matching
 * Figma's chevron right-inset exactly (CONFIRMED 18px at `8:41`; 19px at
 * `6:20`/`6:24`, within 1px — `compare_screenshot_with_figma` 8:2 MINOR closed).
 * `pointer-events-none` lets clicks fall through to the select; `leading-none`
 * keeps the glyph box tight; the size follows the `text-body` scale. The
 * per-state color and the disabled dim are applied by {@link Select}.
 */
const CHEVRON_WRAPPER_CLASSES =
  'pointer-events-none absolute inset-y-0 end-0 flex items-center ' +
  'pe-u18 leading-none text-body';

/**
 * Per-`<option>` classes so the native popup list renders dark-navy and legible
 * (rather than the UA default white): `bg-surface-2` (#13162E) + near-white
 * `text-text-primary` (#F1F5FF). Honored by Chromium (the prototype's target).
 */
const OPTION_CLASSES = 'bg-surface-2 text-text-primary';

/**
 * Select — the bespoke design-system chevron dropdown primitive.
 *
 * Renders a `relative` wrapper holding a single CONTROLLED `<select>` (its
 * native arrow removed via `appearance-none`) and a trailing, `aria-hidden` ▾
 * glyph. The default state is the `bg-card` surface with a white-09 hairline and
 * a muted chevron; the `active` state is the `--gradient-cta` accent fill with no
 * visible border and a light-violet chevron (Figma `6:22`). `options` may be
 * `SelectOption[]` or `string[]` (normalized internally); an optional
 * `placeholder` shows a muted, disabled leading option while the value is empty.
 * The caller `className` is merged onto the wrapper (callers own width/layout)
 * and all remaining native attributes are spread onto the select via `...rest`,
 * with `value` / `onChange` / `disabled` / `className` applied AFTER the spread
 * so they always take effect.
 *
 * @param props - {@link SelectProps}
 * @returns The rendered dropdown control.
 */
export function Select({
  value,
  options,
  onChange,
  active = false,
  placeholder,
  disabled = false,
  className,
  id,
  name,
  ...rest
}: SelectProps): JSX.Element {
  // STABLE id/name fallback (a11y + browser-autofill hygiene). A native form
  // control with neither `id` nor `name` is flagged by Chrome DevTools / the
  // Lighthouse audit ("A form field element should have an id or name
  // attribute"), which surfaced on the App 02 grid sort dropdown (QA Issues 3 &
  // 13). `useId()` yields an SSR-stable identifier (identical on server and
  // client, so no hydration mismatch); a caller-supplied `id`/`name` always wins,
  // and the `name` falls back to the resolved `id` so EVERY Select instance
  // (grid sort, Convert format dropdowns, Preferences font) carries both
  // attributes systemically — not just the one the QA happened to flag.
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const resolvedName = name ?? resolvedId;

  // Normalize every entry to the canonical { label, value } shape so the render
  // path is uniform whether the caller passed objects or bare strings.
  const normalizedOptions: SelectOption[] = options.map(normalizeOption);

  // The placeholder is "showing" only when a placeholder was supplied AND the
  // current value is empty — in which case the closed control displays the
  // placeholder option, tinted with the muted placeholder token.
  const showingPlaceholder = placeholder != null && value === '';

  // VALUE text color: the active gradient and any populated default field use the
  // near-white primary token (#F1F5FF, CONFIRMED on 6:18/6:22/8:39); only an
  // empty default field shows the muted placeholder token (#3A4060).
  const valueTextClass =
    !active && showingPlaceholder ? 'text-text-placeholder' : 'text-text-primary';

  // Compose the select classes: the shared base, then either the active gradient
  // surface (which carries its own near-white text + 600 weight) or the default
  // surface plus the computed value-text color and the default 500 weight. The
  // caller `className` is intentionally NOT here — it lives on the wrapper so
  // callers size the control.
  //
  // `font-medium` (500): Figma `6:19` (Convert input) and `8:40` (Preferences
  // "Georgia") render the DEFAULT value text at Inter Medium 500. 500 is an
  // exact system weight (`--font-weight-medium`), so the weight matches Figma
  // while the size stays on the `text-body` (12px) token. See the
  // BLITZY [TYPOGRAPHY] note in the file header.
  const selectClassName = active
    ? [BASE_SELECT_CLASSES, ACTIVE_SELECT_CLASSES].join(' ')
    : [BASE_SELECT_CLASSES, DEFAULT_SURFACE_CLASSES, 'font-medium', valueTextClass].join(' ');

  // CHEVRON color: light-violet on the active gradient (so it reads), muted
  // slate by default. It dims in lock-step with the disabled select (the glyph
  // is a sibling span and cannot use the `disabled:` variant, so the dim is
  // derived from the `disabled` prop here).
  const chevronClassName = [
    CHEVRON_WRAPPER_CLASSES,
    active ? 'text-accent-light' : 'text-text-muted',
    disabled ? 'opacity-50' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // The caller `className` sizes/positions the WRAPPER (the "control" from the
  // caller's perspective); `relative` anchors the absolutely-positioned ▾ glyph.
  // `filter(Boolean)` drops an absent className so the join never leaves a stray
  // trailing space.
  const wrapperClassName = ['relative', className].filter(Boolean).join(' ');

  // Controlled-change adapter: hand the caller the chosen option's value (not the
  // raw event), so screen code binds `onChange={setValue}` directly. Optional-
  // chained so an omitted `onChange` is a safe no-op.
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <div className={wrapperClassName}>
      <select
        {...rest}
        id={resolvedId}
        name={resolvedName}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={selectClassName}
      >
        {/* Muted, disabled+hidden leading option shown only while value is empty. */}
        {placeholder != null && (
          <option value="" disabled hidden className={OPTION_CLASSES}>
            {placeholder}
          </option>
        )}
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value} className={OPTION_CLASSES}>
            {option.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className={chevronClassName}>
        {CHEVRON_GLYPH}
      </span>
    </div>
  );
}

export default Select;
