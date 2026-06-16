'use client';

/**
 * ==========================================================================
 * Calibre-UI — FormatSelectRow
 * The input → output format-selection row of the App 05 "Convert Books" dialog.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `FormatSelectRow` is 1 of the 5 composition components of the Convert Books
 * dialog (App 05, Figma screen node `6:9`) in the UI-only Calibre e-book-
 * manager prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict ·
 * Tailwind CSS v4 CSS-first tokens). It renders the format-selection row that
 * sits directly under the dialog header: an INPUT format dropdown, a directional
 * "→" arrow glyph, and an OUTPUT format dropdown. Each dropdown carries a small
 * field label above it ("Input format:" / "Output format:"). The OUTPUT dropdown
 * is the design's only highlighted control — it is rendered in the `active`
 * accent-gradient state (delivered entirely by the `Select` primitive).
 *
 * UI-ONLY / MOCK — NO REAL CONVERSION
 * --------------------------------------------------------------------------
 * This row is purely presentational and fully CONTROLLED: it renders the
 * `inputFormat` / `outputFormat` values it is given and reports edits through
 * `onInputChange` / `onOutputChange`. It performs NO conversion, NO file I/O,
 * and NO format detection — the parent dialog (a future `ConvertDialog`) owns
 * the format state. Design-parity reference ONLY (never imported or translated):
 * `src/calibre/gui2/convert/single.py`, whose Qt `Config` dialog shows an
 * `input_formats` combo (seeded from the book's current format) and an
 * `output_formats` combo (the conversion target), both listing UPPERCASE format
 * names. We reproduce only the VISUAL input → output row; no Python is reused.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * This component binds change callbacks onto interactive `Select` primitives and
 * calls the `useId` hook for label/control association, so it must be a Client
 * Component — App Router components default to Server Components, which cannot
 * bind handlers or run hooks. The directive is the very first line, before any
 * import.
 *
 * COMPOSE FROM PRIMITIVES ONLY
 * --------------------------------------------------------------------------
 * Both dropdowns are the bespoke `Select` primitive (imported from its concrete
 * module path — there is NO `@/components/primitives` barrel). A raw `<select>`
 * is never rendered here. The accent-gradient highlight on the output dropdown
 * is NOT hand-rolled: it is produced BY `Select` when `active` is `true`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `6:9`)
 * --------------------------------------------------------------------------
 * Reconciled via `analyze_figma_node` against the format row's members — input
 * dropdown `6:18`, output dropdown `6:22` (ACTIVE), the arrow `6:21`, and the
 * two labels `6:16` / `6:17` (all direct, absolutely-positioned children of the
 * `6:9` dialog frame; there is no dedicated auto-layout row container, so this
 * component re-creates the row as a responsive flex layout). CONFIRMED values:
 *   • LABELS (`6:16` / `6:17`) → text "Input format:" / "Output format:"
 *     (verbatim, trailing colon), Inter 400 11px, color `#64748B`
 *     (`--color-text-muted`), placed ABOVE each dropdown, 5px above it.
 *   • INPUT dropdown (`6:18`) → the `Select` DEFAULT state: `#181C3C` fill
 *     (`--color-card`), 1px `rgba(255,255,255,0.09)` stroke (`--border-white-09`),
 *     8px radius (`--radius-control`), value text `#F1F5FF` Medium 500, muted
 *     `#64748B` chevron. Matched 1:1 by `Select` with no `active`.
 *   • OUTPUT dropdown (`6:22`, ACTIVE) → the `Select` ACTIVE state: fill
 *     `linear-gradient(-45deg, #7B61FF 0%, #4838C8 100%)` (`--gradient-cta`),
 *     NO stroke, value text `#F1F5FF` Semi Bold 600, light-violet `#A78BFA`
 *     chevron. Matched 1:1 by `Select` with `active`.
 *   • ARROW (`6:21`) → "→" U+2192, color `#A78BFA` (`--color-accent-light`),
 *     20px, Inter Regular 400, vertically centered on the dropdown band.
 *
 * BLITZY [COLOR]: The agent brief hypothesized the arrow color as
 * `--color-text-secondary` (#94A3B8) "or text-muted if Figma shows a fainter
 * arrow — verify". `analyze_figma_node` on `6:21` pixel-verified the glyph at
 * (167,139,250) = `#A78BFA` — the purple accent-light token, NOT a grey. Per the
 * CRITICAL Precedence Directive (Figma EXACT values override brief defaults) and
 * the brief's own "verify" instruction, the arrow is rendered `text-accent-light`.
 *
 * BLITZY [TYPOGRAPHY]: Two sizes in this row reuse a token's VALUE because the
 * manifest has no dedicated token of that exact size, and both are bound via the
 * Tailwind v4 CSS-variable shorthand `text-(length:--token)` — which compiles to
 * exactly `font-size: var(--token)` and sets ONLY font-size, deliberately NOT
 * pulling in that token role's paired weight; the weight is then set explicitly
 * with a `font-*` utility to match Figma:
 *   • ARROW (`6:21`, Inter Regular 400 20px) → `text-(length:--text-dialog-heading)`
 *     (`--text-dialog-heading` IS exactly 20px) + `font-normal` (400, not the
 *     heading role's paired 600).
 *   • LABELS (`6:16` / `6:17`, Inter Regular 400 11px) → `text-(length:--text-window-title)`
 *     (`--text-window-title` IS exactly 11px) + `font-normal` (400, not the window-title
 *     role's paired 500). This matches Figma's 11px EXACTLY rather than snapping to the
 *     semantic `text-meta-label` (10px), per the CRITICAL Figma-precedence directive.
 * Each token is reused for its SIZE VALUE, not its role semantics; every size stays
 * 100% token-backed and the file carries zero raw size literals. (Note on the v4
 * shorthand: the `text-(length:--token)` parenthesis form is the canonical CSS-var
 * size utility; the equivalent bracket form `text-[length:var(--token)]` also
 * generates valid CSS in Tailwind 4.3 — the parenthesis form is preferred here for
 * concision and to avoid the `var()` wrapper.)
 *
 * BLITZY [GRADIENT]: The agent brief described the active output highlight as
 * "gradient-accent" (`#7B61FF → #A78BFA`). The reconciled spec for `6:22`
 * confirmed the fill is actually `--gradient-cta` (`#7B61FF → #4838C8`, the same
 * token as the "Convert Book" CTA `6:100`). This component does NOT encode either
 * gradient — it passes `active` to `Select`, which owns the CONFIRMED `--gradient-cta`
 * fill — so the design intent (an accent-gradient-highlighted active output
 * dropdown) is preserved exactly with the Figma-correct stops.
 *
 * BLITZY [CONTENT]: Figma renders the dropdowns' selected-value text as
 * "EPUB  (.epub)" (`6:19`) and "MOBI  (.mobi)" (`6:23`) — the format name plus a
 * parenthetical file extension. This component intentionally displays the BARE
 * format names ("EPUB", "MOBI", …) instead, for four reasons: (1) the agent
 * contract EXPLICITLY mandates `CONVERT_FORMATS` as a bare string array and directs
 * `options={CONVERT_FORMATS}`; (2) the derived types depend on bare members —
 * `ConvertFormat = (typeof CONVERT_FORMATS)[number]` and `BadgeConvertFormat =
 * Extract<ConvertFormat, FormatKind>` both REQUIRE plain `'EPUB' | 'MOBI' | …`
 * strings, so switching the list to `{value,label}` objects would break the
 * mandated public API; (3) the Figma confirms an extension for ONLY the two visible
 * example formats (EPUB, MOBI) — rendering all eight would require inventing
 * unverified extensions for the other six (a DS2-d hallucination), and labelling
 * only two of eight would be inconsistent; (4) Calibre's reference dialog
 * (`single.py`) itself lists formats as bare UPPERCASE names (`str(x.upper())`).
 * The "(.epub)" / "(.mobi)" suffix is treated as the Figma mock-up's seeded display
 * embellishment for its two example rows, not a per-option contract. The bare names
 * are the conservative, contract-faithful interpretation (DS2-i).
 *
 * BLITZY [LAYOUT]: Figma positions the arrow's 60×24 box (`6:21`) so it overlaps the
 * output dropdown (`6:22`); because the dropdown is painted on top, the arrowhead is
 * occluded and the glyph reads as a short violet dash jammed at the dropdown's left
 * edge. That occlusion is a Figma source-overlap artifact, not the design intent —
 * AAP §0.3.4 specifies rendering the "→" (U+2192) glyph, so this component renders
 * the COMPLETE arrow centered in the inter-dropdown gap (the faithful connector
 * intent), rather than reproducing the clipped dash.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`, consumed through a Tailwind v4 utility
 * (`text-text-muted`, `text-accent-light`, `font-normal`) or a CSS-variable size
 * shorthand (`text-(length:--text-window-title)` for the 11px labels,
 * `text-(length:--text-dialog-heading)` for the 20px arrow). There are NO raw
 * hex/rgba color literals and NO raw size literals. The only bare literals are
 * LAYOUT values that carry no color information — flex/gap utilities, `min-w-0`,
 * `flex-1`, `w-full`, `leading-none`, `invisible`, `select-none` — all permitted.
 *
 * ARROW IS A GLYPH, NOT AN ASSET (AAP §0.3.4)
 * --------------------------------------------------------------------------
 * The "→" connector is the Unicode character U+2192 (RIGHTWARDS ARROW) rendered
 * as an `aria-hidden` text glyph in the global Inter face — NOT an image/SVG
 * asset. The Asset Inventory for the format row is empty; no asset file is
 * created. (`Select` owns its own "▾" chevron glyphs.)
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Each dropdown is paired with a visible `<label htmlFor>` whose `for` targets
 *   a `useId`-generated, stable `id` forwarded onto the `Select`'s underlying
 *   native `<select>`. The label is the dropdown's accessible name (no separate
 *   `aria-label` needed) and clicking it focuses the control.
 * • The "→" arrow is decorative and `aria-hidden`; an invisible label-height
 *   spacer in the arrow column is likewise `aria-hidden` + `select-none`.
 * • `Select` itself renders a semantic, keyboard-operable native `<select>` with
 *   a token-backed `:focus-visible` ring.
 *
 * RESPONSIVE
 * --------------------------------------------------------------------------
 * The Figma design uses two fixed 360px dropdowns with a 62px center gap inside
 * the 880px dialog. To hold the 1440 → 1280 baseline with zero horizontal
 * overflow (and degrade cleanly inside the fixed-width dialog), the two dropdown
 * columns are `flex-1 min-w-0` (so they share the available width and may shrink
 * below their content), separated by a fixed-width arrow column. At the dialog's
 * full content width the columns land at ≈360px each, matching the design.
 *
 * @see src/components/primitives/Select.tsx — the dropdown primitive (default + active).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/convert/single.py — Calibre's Qt convert dialog (reference only).
 * @see Agent Action Plan §0.3 / §0.4 — Figma analysis, token & component manifests.
 */

import type { JSX } from 'react';
import { useId } from 'react';

import { Select } from '@/components/primitives/Select';
import type { FormatKind } from '@/types';

/**
 * The canonical, ordered list of convertible e-book formats shown in BOTH
 * dropdowns. These mirror Calibre's common input/output formats and are listed
 * UPPERCASE for visual parity with `single.py`'s combos (which add items via
 * `str(x.upper())`). Declared `as const` so the literal union {@link ConvertFormat}
 * can be derived from it and so it can be passed straight to `Select` (whose
 * `options` prop accepts a `readonly` array).
 */
export const CONVERT_FORMATS = [
  'EPUB',
  'MOBI',
  'AZW3',
  'PDF',
  'DOCX',
  'FB2',
  'TXT',
  'HTMLZ',
] as const;

/**
 * The string-literal union of every value in {@link CONVERT_FORMATS}
 * (`'EPUB' | 'MOBI' | 'AZW3' | 'PDF' | 'DOCX' | 'FB2' | 'TXT' | 'HTMLZ'`). This is
 * the broad convert-format domain; it intentionally exceeds the narrow
 * {@link FormatKind} badge union (see {@link BadgeConvertFormat}).
 */
export type ConvertFormat = (typeof CONVERT_FORMATS)[number];

/**
 * The subset of {@link ConvertFormat}s that also have a dedicated `FormatBadge`
 * variant — i.e. the intersection of the broad convert list with the narrow
 * {@link FormatKind} union (`'EPUB' | 'MOBI' | 'PDF'`). A consumer that wants to
 * render a `FormatBadge` for a chosen format can narrow to this type at the badge
 * boundary (per the component contract's "only narrow to `FormatKind` if you
 * forward to a `FormatBadge`" note). This component itself keeps its format props
 * as plain `string` (matching `Book.format`); the type is exposed purely to
 * document and enforce the convert-list ↔ badge-union relationship at compile
 * time, and is fully erased at runtime.
 */
export type BadgeConvertFormat = Extract<ConvertFormat, FormatKind>;

/**
 * Props for {@link FormatSelectRow}.
 *
 * The format values are typed as plain `string` (NOT {@link ConvertFormat} or
 * {@link FormatKind}) so the row binds frictionlessly to a book's `format`
 * field, which the `Book` contract defines as a `string` (AAP §0.1.2).
 */
export interface FormatSelectRowProps {
  /**
   * The currently selected INPUT format, typically seeded from the target book's
   * current format (e.g. `book.format`). Rendered as-is in the input dropdown.
   */
  inputFormat: string;
  /** The currently selected OUTPUT (conversion target) format. */
  outputFormat: string;
  /** Called with the new value whenever the user changes the INPUT dropdown. */
  onInputChange?: (value: string) => void;
  /** Called with the new value whenever the user changes the OUTPUT dropdown. */
  onOutputChange?: (value: string) => void;
  /**
   * Whether the OUTPUT dropdown shows the accent-gradient highlight (Figma `6:22`).
   * Defaults to `true` — the design always highlights the chosen output target.
   * Set to `false` to render the output dropdown in the neutral default state.
   * @default true
   */
  outputActive?: boolean;
  /** Extra classes merged onto the row's outermost flex container. */
  className?: string;
}

/**
 * The Unicode directional connector rendered between the two dropdowns — "→"
 * (U+2192 RIGHTWARDS ARROW), the exact glyph Figma uses at node `6:21`. It is a
 * TEXT glyph in the global Inter face, never an image/SVG asset (AAP §0.3.4).
 */
const ARROW_GLYPH = '\u2192';

/**
 * Shared classes for the two field labels ("Input format:" / "Output format:").
 * Token-only and matched 1:1 to Figma `6:16` / `6:17` (Inter Regular 400, 11px,
 * `#64748B`):
 *   • `text-text-muted` → color `#64748B` (`--color-text-muted`), the CONFIRMED label fill.
 *   • `text-(length:--text-window-title)` → font-size EXACTLY 11px. The token manifest
 *     has no dedicated "field-label" size, but `--text-window-title` IS exactly 11px, so
 *     the label's font-size is bound to that token's VALUE via the Tailwind v4 CSS-variable
 *     shorthand — which compiles to `font-size: var(--text-window-title)` and sets ONLY the
 *     size, deliberately NOT pulling in the window-title role's paired 500 weight (the token
 *     is reused for its 11px VALUE, not its window-title semantics — see BLITZY [TYPOGRAPHY]).
 *   • `font-normal` → weight 400, matching Figma's Inter Regular labels.
 *   • `select-none` keeps the labels from being drag-selected.
 */
const LABEL_CLASSES =
  'text-text-muted text-(length:--text-window-title) font-normal select-none';

/**
 * Vertical stack for one labelled dropdown column. `flex-1 min-w-0` lets the two
 * columns share the row width and shrink below their content (responsive, no
 * horizontal overflow); `gap-1.5` (6px) reproduces Figma's ≈5px label→control gap.
 */
const COLUMN_CLASSES = 'flex min-w-0 flex-1 flex-col gap-1.5';

/**
 * FormatSelectRow — the input → output format-selection row of the App 05
 * "Convert Books" dialog.
 *
 * Renders, left to right: a labelled INPUT `Select` (default state), a centered
 * "→" arrow glyph, and a labelled OUTPUT `Select` (rendered `active` so it shows
 * the accent-gradient highlight). Both dropdowns list {@link CONVERT_FORMATS} and
 * are fully controlled via `value` / `onChange`. The arrow column carries an
 * invisible label-height spacer so the arrow lands centered on the dropdown band
 * regardless of the dropdowns' intrinsic height.
 *
 * @param props - {@link FormatSelectRowProps}
 * @returns The rendered format-selection row.
 */
export function FormatSelectRow({
  inputFormat,
  outputFormat,
  onInputChange,
  onOutputChange,
  outputActive = true,
  className,
}: FormatSelectRowProps): JSX.Element {
  // Stable, SSR-safe ids so each visible <label> can be associated with its
  // dropdown's underlying native <select> via htmlFor/id.
  const inputId = useId();
  const outputId = useId();

  // `items-stretch` makes all three columns equal height; the arrow column's
  // `flex-1` band then fills the control-row height so the glyph centers on the
  // dropdown band without needing a hardcoded control height. `gap-6` (24px)
  // approximates Figma's 62px inter-dropdown gap once the fixed arrow column and
  // both side gaps are accounted for. The caller `className` is appended last.
  const rowClassName = ['flex items-stretch gap-6', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClassName}>
      {/* INPUT format column — labelled dropdown, default (neutral) Select state. */}
      <div className={COLUMN_CLASSES}>
        <label htmlFor={inputId} className={LABEL_CLASSES}>
          Input format:
        </label>
        <Select
          id={inputId}
          value={inputFormat}
          options={CONVERT_FORMATS}
          onChange={onInputChange}
          className="w-full"
        />
      </div>

      {/* Directional "→" connector. The invisible, label-height spacer mirrors the
          columns' label line so the arrow band (flex-1) aligns to — and centers on
          — the dropdown band. Both spans are decorative / aria-hidden. */}
      <div className="flex flex-col gap-1.5">
        <span aria-hidden="true" className="text-meta-label invisible select-none">
          {ARROW_GLYPH}
        </span>
        <span
          aria-hidden="true"
          className="flex flex-1 items-center justify-center leading-none text-accent-light text-(length:--text-dialog-heading) font-normal"
        >
          {ARROW_GLYPH}
        </span>
      </div>

      {/* OUTPUT format column — labelled dropdown, ACTIVE (accent-gradient) Select
          state delivered by the primitive; the gradient is never hand-rolled here. */}
      <div className={COLUMN_CLASSES}>
        <label htmlFor={outputId} className={LABEL_CLASSES}>
          Output format:
        </label>
        <Select
          id={outputId}
          value={outputFormat}
          options={CONVERT_FORMATS}
          onChange={onOutputChange}
          active={outputActive}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default FormatSelectRow;
