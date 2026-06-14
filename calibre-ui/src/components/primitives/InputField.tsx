'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — InputField
 * The single text / number / search text-entry primitive.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `InputField` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the ONE controlled text-entry control used everywhere a raw `<input>`
 * would otherwise appear:
 *   • SEARCH — the top-toolbar search field (App 01/02, Figma node `2:34`).
 *   • TEXT   — the Metadata Editor's single-line fields (App 07 `9:9`: Title,
 *              Author(s), Title/Author Sort, Series, Publisher, Publication
 *              Date, Language) and the Convert dialog's text inputs.
 *   • NUMBER — numeric fields such as the Metadata "Series index" (`9:67`).
 * Screen code must NEVER render a raw `<input>`; it always composes this
 * primitive so the surface, border, radius, placeholder, focus, and typography
 * stay identical and 100% token-backed across every screen.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This primitive renders a real, CONTROLLED `<input>` (its `value` is owned by
 * the caller and every keystroke is reported through `onChange`), so it must be
 * a Client Component — App Router components default to Server Components, which
 * cannot bind change handlers. The directive is the very first line, before any
 * import.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against the search field (`2:34`, parent
 * screen `2:2`) and the Metadata Editor modal (`9:9`). Both the search field
 * and EVERY single-line metadata field share ONE resting look — so this
 * primitive renders a single canonical, fully-token-backed field:
 *   • RESTING fill   → `#181C3C` (= `--color-card`)   [CONFIRMED 2:34 + 9:53/9:56…]
 *   • RESTING border → `rgba(255,255,255,0.09)` 1px (= `--border-white-09`)
 *   • RADIUS         → `8px` (= `--radius-control`)
 *   • PLACEHOLDER    → `#3A4060` (= `--color-text-placeholder`)
 *   • VALUE text     → `#F1F5FF` (= `--color-text-primary`)
 *   • TYPOGRAPHY     → `text-body` (Inter 400 / 12px) — see BLITZY [TYPOGRAPHY]
 *
 * FOCUS STATE — EXACT, NO GLOW (BLITZY [FOCUS])
 * --------------------------------------------------------------------------
 * The agent brief tentatively suggested a `box-shadow` "purple glow" for the
 * App 07 Title field. analyze_figma_node on the ONLY focused field (Title
 * `9:53`) CONFIRMED there is NO `effects`/box-shadow token at all — a pixel
 * scan showed a hard 1px border transition with zero falloff/spread/blur. The
 * focused appearance is produced ENTIRELY by two fills:
 *   • focused fill   → `rgba(123,97,255,0.1)`  → `focus:bg-accent/10`
 *   • focused border → `rgba(123,97,255,0.5)`  → `focus:border-accent/50`
 * Adding a box-shadow would HALLUCINATE an effect not in the design (DS2-d), so
 * this primitive deliberately does NOT emit one. The accent opacity-modifier
 * pattern (`bg-accent/10`, `border-accent/50`) resolves to `--color-accent`
 * (#7B61FF) and mirrors the sibling `Button` (`bg-danger/10`) and `TagPill`
 * (`bg-accent/20`, `border-accent/30`). `:focus` (NOT `:focus-visible`) is used
 * intentionally: a text field SHOULD reveal its active affordance whenever it
 * is focused — including by mouse click — which is exactly when the user begins
 * typing (BLITZY [A11Y]). Focus styling is invisible at rest (DS2-e).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed via a Tailwind v4 utility (`bg-card`,
 * `rounded-control`, `text-text-primary`, `text-body`,
 * `placeholder:text-text-placeholder`), an opacity-modifier on a color token
 * (`bg-accent/10`, `border-accent/50`), or a CSS-variable arbitrary value
 * (`border-[var(--border-white-09)]`). There are NO raw hex / rgba color
 * literals. The only bare literals are LAYOUT / appearance values that carry no
 * color information — paddings (`px-3`, `py-2`, `ps-9`), `w-full`, and the
 * number-spinner / search-decoration `appearance` resets — all permitted.
 *
 * BLITZY [TYPOGRAPHY]: Figma renders the search placeholder at Inter 400 11px
 * (`2:35`) and the metadata value at Inter 500 13px (`9:54`). Per the agent
 * contract's explicit "`text-body`" instruction and AAP §0.3 scope/intent
 * precedence, this single primitive uses the one `text-body` token (12px / 400)
 * for all three variants. Each Figma size is within ±1px of 12px (DS4 silent
 * snap), and the metadata weight 500→400 is the adjacent normalized step — a
 * deliberate single-canonical-look reconciliation (cf. `TagPill`).
 *
 * BLITZY [COLOR]: Figma shows NON-focused metadata fields with their values in
 * `#94A3B8` (a static-mock dimming of inactive fields) and the focused field's
 * value in `#F1F5FF`. A live controlled input must stay legible while the user
 * types, so the value is rendered in `text-text-primary` (#F1F5FF) in all
 * states — matching both the agent contract ("input text color #F1F5FF") and
 * the confirmed focused field.
 *
 * ICONS ARE GLYPHS, NOT ASSETS (AAP §0.3.4)
 * --------------------------------------------------------------------------
 * The optional `icon` is an emoji / unicode glyph (e.g. 🔍) passed as text — no
 * image / SVG asset exists or is created (both Figma analyses confirmed zero
 * binary assets). In Figma the 🔍 is baked inline at the head of the search
 * placeholder string; per the agent contract this primitive instead exposes it
 * as a dedicated `icon` prop rendered as a leading, absolutely-positioned glyph
 * (so it stays visible while typing). It is `aria-hidden` (decorative) and the
 * input reserves inline-start padding (`ps-9`) to clear it.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * A `relative` wrapper `<div>` hosts the (optional) leading glyph and the
 * `<input>`. The caller `className` is merged onto the WRAPPER (so callers own
 * the field's width / layout, e.g. `w-[220px]` for the toolbar search or
 * `w-full` for a metadata field) while the input is `w-full` and carries the
 * token-backed visuals. All remaining native input attributes (`id`, `name`,
 * `aria-*`, `disabled`, `readOnly`, `maxLength`, `style`, …) are forwarded to
 * the `<input>` via `...rest`; the explicit `type` / `value` / `onChange` /
 * `placeholder` / `className` are applied AFTER the spread so they always win.
 * The control is fully CONTROLLED: it renders `value` and reports edits through
 * `onChange(nextValue)` (the raw string, not the event).
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Renders a semantic `<input>` — natively focusable and keyboard-operable.
 * • The leading glyph is `aria-hidden` (the input owns the accessible name).
 * • Callers MUST supply an accessible name via a `<label htmlFor>` bound to a
 *   forwarded `id`, or an `aria-label` / `aria-labelledby` (forwarded via
 *   `...rest`) — e.g. `aria-label="Search library"` for the label-less toolbar
 *   search.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * views.py` (the Qt library view whose `connect_to_search_box` models the
 * library search behavior). Nothing is imported or translated from the Python
 * codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import type { ChangeEvent, InputHTMLAttributes, JSX, ReactNode } from 'react';

/**
 * The three input roles, each CONFIRMED against a Figma node (see header):
 * `text` (metadata single-line fields), `number` (numeric fields such as the
 * Series index `9:67`), and `search` (the top-toolbar field `2:34`). Every
 * variant shares one canonical surface/border/radius/typography; the variant
 * only changes the native input `type` and a few appearance resets.
 */
export type InputVariant = 'text' | 'number' | 'search';

/**
 * Props for {@link InputField}.
 *
 * Extends the native `<input>` attribute set (so `id`, `name`, `aria-*`,
 * `disabled`, `readOnly`, `maxLength`, `style`, `autoComplete`, … are all
 * forwarded via `...rest`) EXCEPT `onChange`, which is re-declared below with a
 * simpler value-first signature suited to this controlled primitive.
 */
export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** The current (controlled) field value. Always rendered as-is. */
  value: string;
  /**
   * Called on every edit with the input's NEXT string value (already unwrapped
   * from the change event, so callers can bind `onChange={setValue}`
   * directly). Optional so the field can be rendered read-only / display-only.
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder shown when the field is empty, rendered in the muted
   * `--color-text-placeholder` (#3A4060) token (e.g. "Search library...").
   */
  placeholder?: string;
  /**
   * Visual + behavioral role. Drives the native `type` (`number` → numeric
   * entry, `search` → search semantics, `text` → free text). All three share
   * one canonical surface/border/radius/typography (see file header).
   * @default 'text'
   */
  variant?: InputVariant;
  /**
   * Optional leading glyph — an emoji / unicode character (e.g. 🔍) rendered as
   * an absolutely-positioned, `aria-hidden` decoration at the inline-start; the
   * input reserves left padding (`ps-9`) to clear it. NOT an image/SVG asset.
   */
  icon?: ReactNode;
}

/**
 * Variant-invariant input classes — the single canonical, token-backed field.
 *
 * - Box: `block w-full` fills the wrapper (callers size the wrapper).
 * - Surface: `bg-card` (#181C3C) + 1px `border-[var(--border-white-09)]`
 *   resting border + `rounded-control` (8px). All CONFIRMED for the search
 *   field (`2:34`) and every metadata field (`9:53`/`9:56`…).
 * - Type: `text-text-primary` (#F1F5FF) value + `placeholder:text-text-placeholder`
 *   (#3A4060) + the `text-body` (Inter 400 / 12px) scale.
 * - Height: set PER VARIANT below (the input's native single-line vertical
 *   centering positions the value), NOT here — see `VARIANT_INPUT_CLASSES`.
 *   BLITZY [SIZING]: Figma uses two field heights for the same control — the
 *   toolbar search field (`2:34`) is 32px while the metadata fields
 *   (`9:53`/`9:56`/`9:67`) are 38px. A single shared `py-2` rendered ~36px
 *   (compare_screenshot_with_figma flagged the search field at +4px vs 32px),
 *   so vertical padding is dropped here and an exact, token-backed height is
 *   applied per variant: `search → h-8` (32px, exact `2:34`) and
 *   `text`/`number → h-9` (36px; the 38px metadata field snaps to the nearest
 *   spacing-scale token, −2px, within DS4 tolerance). This intentionally
 *   overrides the prompt's uniform `py-2` so each Figma context matches.
 *   Horizontal padding is still added per-icon below (`px-3` / `ps-9`).
 * - Focus (EXACT Figma, NO glow — see header): `focus:bg-accent/10` +
 *   `focus:border-accent/50`, with the default UA outline removed
 *   (`outline-none`). Color changes animate only when motion is allowed (UI6).
 */
const BASE_INPUT_CLASSES =
  'block w-full bg-card border border-[var(--border-white-09)] rounded-control ' +
  'text-text-primary text-body placeholder:text-text-placeholder ' +
  'outline-none ' +
  'focus:bg-accent/10 focus:border-accent/50 ' +
  'motion-safe:transition-colors';

/**
 * Per-variant EXTRA input classes — exact Figma height + appearance resets.
 *
 * Height (token-backed, see `BASE_INPUT_CLASSES` BLITZY [SIZING] note):
 * - `text`/`number` → `h-9` (36px) to match the 38px metadata fields
 *   (`9:53`/`9:56`/`9:67`) at the nearest spacing-scale step.
 * - `search`        → `h-8` (32px) to match the toolbar search field (`2:34`)
 *   EXACTLY (resolves the compare_screenshot_with_figma height finding).
 *
 * Appearance resets (carry NO color — permitted bare literals under the
 * zero-hardcoded-token rule):
 * - `number` — reproduce Figma's spinner-LESS numeric field (`9:67`): hide the
 *   WebKit inner/outer spin buttons and set Firefox `appearance: textfield`,
 *   so a number field reads as the same clean box as a text field.
 * - `search` — hide the WebKit search decoration / cancel button so the field
 *   reads as the clean rounded box Figma shows (`2:34`), never a UA-styled
 *   search control.
 */
const VARIANT_INPUT_CLASSES: Record<InputVariant, string> = {
  text: 'h-9',
  number:
    'h-9 ' +
    '[appearance:textfield] ' +
    '[&::-webkit-outer-spin-button]:appearance-none ' +
    '[&::-webkit-inner-spin-button]:appearance-none ' +
    '[&::-webkit-inner-spin-button]:m-0',
  search:
    'h-8 ' +
    '[&::-webkit-search-cancel-button]:appearance-none ' +
    '[&::-webkit-search-decoration]:appearance-none',
};

/**
 * Leading-glyph wrapper classes (only rendered when `icon` is supplied).
 *
 * Absolutely pinned to the inline-start and vertically centered over the input,
 * with a 12px inset (`ps-3`, ≈ Figma's 10px). `pointer-events-none` lets clicks
 * fall through to the input; `text-text-muted` + `text-body` tint and size a
 * non-emoji glyph (a color emoji renders in its own native palette regardless).
 * `leading-none` keeps the glyph box tight. The glyph is `aria-hidden` at the
 * call site (the input owns the accessible name).
 */
const ICON_WRAPPER_CLASSES =
  'pointer-events-none absolute inset-y-0 start-0 flex items-center ' +
  'ps-3 leading-none text-text-muted text-body';

/**
 * InputField — the bespoke design-system text/number/search input primitive.
 *
 * Renders a `relative` wrapper holding an optional leading glyph and a single
 * CONTROLLED `<input>`. Class strings are composed token-first; the caller
 * `className` is merged onto the wrapper (callers own width/layout) and all
 * remaining native attributes are spread onto the input via `...rest`, with
 * `type` / `value` / `onChange` / `placeholder` applied AFTER the spread so
 * they always take effect. The input always carries a change handler (so React
 * never warns about a controlled input without `onChange`); when the caller
 * omits `onChange`, edits are simply not propagated.
 *
 * @param props - {@link InputFieldProps}
 * @returns The rendered input field.
 */
export function InputField({
  value,
  onChange,
  placeholder,
  variant = 'text',
  icon,
  className,
  ...rest
}: InputFieldProps): JSX.Element {
  // The caller `className` sizes/positions the WRAPPER (the "field" from the
  // caller's perspective); `relative` anchors the optional, absolutely-
  // positioned leading glyph. `filter(Boolean)` drops an absent className.
  const wrapperClassName = ['relative', className].filter(Boolean).join(' ');

  // Horizontal padding depends on whether a leading glyph is present: reserve
  // inline-start space (`ps-9`) to clear the glyph, otherwise symmetric `px-3`.
  const paddingClassName = icon != null ? 'ps-9 pe-3' : 'px-3';

  // Compose the input classes (the caller `className` is intentionally NOT here
  // — it lives on the wrapper). `filter(Boolean)` drops the empty `text`-variant
  // extra string so the joined result never has stray double spaces.
  const inputClassName = [
    BASE_INPUT_CLASSES,
    paddingClassName,
    VARIANT_INPUT_CLASSES[variant],
  ]
    .filter(Boolean)
    .join(' ');

  // Controlled-change adapter: hand the caller the unwrapped NEXT string value
  // (not the raw event), so screen code binds `onChange={setValue}` directly.
  // Optional-chained so an omitted `onChange` is a safe no-op.
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <div className={wrapperClassName}>
      {icon != null && (
        <span aria-hidden="true" className={ICON_WRAPPER_CLASSES}>
          {icon}
        </span>
      )}
      <input
        {...rest}
        type={variant}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}

export default InputField;

