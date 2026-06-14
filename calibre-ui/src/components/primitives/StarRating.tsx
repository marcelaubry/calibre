'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — StarRating
 * The amber 0–5 star rating primitive (display + editable variants).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `StarRating` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It renders a book's 0–5 rating (in 0.5 increments) as amber stars:
 *   • DISPLAY (read-only) — the library list table rows, the right DETAIL panel
 *     (App 01, Figma node `2:348`), and the cover-grid cards (App 02).
 *   • EDITABLE — the Metadata Editor modal (App 07, Figma node `9:31`), where
 *     the user can click / key a new rating.
 * Screen code must NEVER hand-roll star glyphs; it always composes this
 * primitive so the amber hue, glyph set, and half-star fill stay identical.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The editable variant holds hover-preview state (`useState`) and binds
 * `onMouseEnter` / `onClick` / `onKeyDown` handlers, so the component is a
 * Client Component (App Router components default to Server Components, which
 * cannot hold state or attach event handlers). Making the WHOLE component a
 * client component (directive on the very first line) avoids a server/client
 * split — the display-only usage works perfectly inside a client component, and
 * its output is SSR-deterministic (see below), so it hydrates without warnings.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node against App 01 (`2:2`) and App 07 (`9:9`):
 *   • DISPLAY node `2:348` — a single TEXT node "★★★★★", Inter Regular 400,
 *     14px, fill `#F59E0B`, 74×17px, left/top aligned. The detail-panel book is
 *     a 5/5 rating, so only filled glyphs show there.
 *   • Empty stars — CONFIRMED from the App 01 table-row rating nodes (e.g.
 *     `2:119` "★★★★☆", `2:143` "★★★☆☆"): the WHOLE string (filled ★ AND empty
 *     ☆) carries the single amber fill `#F59E0B`. The empty star differs ONLY
 *     by glyph (hollow ☆ U+2606 vs solid ★ U+2605), NEVER by hue — it is amber
 *     hollow, not gray.
 *   • EDITABLE node `9:31` — single TEXT "★★★★★", Inter Regular 400, 20px, fill
 *     `#F59E0B`. Callers (the Metadata Editor) pass `size={20}` (the in-grid
 *     picker `9:79` uses 24px); this primitive's DEFAULT size is 14 (the
 *     detail-panel size), and the `size` prop scales every other usage.
 *   • SPACING — both nodes are a single string with letter-spacing 0; the
 *     inter-star spacing is purely the glyph advance (≈1.05× font-size: 74÷5 =
 *     14.8px at 14px, 105÷5 = 21px at 20px). This primitive therefore adds NO
 *     gap utility — the per-star wrappers sit FLUSH so their combined advance
 *     reproduces the original single-string spacing exactly.
 *   • NO numeric label accompanies the stars in either node, and the static
 *     design shows NO focus/hover affordance (the editable interactivity below
 *     is implementer-designed and does not conflict with the static frames).
 *
 * HALF-STARS (data-state completeness — FG2)
 * --------------------------------------------------------------------------
 * The Figma MOCK only ever shows whole-integer ratings (3/4/5), but the `Book`
 * contract defines `rating` as 0–5 in 0.5 increments, the shared `@/lib/format`
 * `getStarFill` helper emits a `'half'` state, and Calibre's own rating delegate
 * supports half stars. This primitive therefore renders ALL THREE fill states
 * (full / half / empty) so any valid rating is correct — verified with 4.5, 3,
 * 2.5, 0, and 5. The half star is drawn as a 50%-clipped solid ★ layered over a
 * hollow ☆ (both amber), which renders crisply across fonts (the dedicated
 * U+2BE8 half-glyph Calibre uses has poor web-font coverage).
 *
 * CENTRALIZED FILL MATH (SSR determinism)
 * --------------------------------------------------------------------------
 * The fill math is NOT reimplemented here — it is delegated to
 * `getStarFill(rating)` from `@/lib/format`, which returns a fixed length-5
 * `StarFill[]` (clamps 0–5, coerces NaN→0, deterministic). The same helper
 * drives BOTH the display render and the editable hover preview, so the
 * half-star logic stays in one place and the server/client output is identical
 * (no hydration mismatch). `@/lib` has no barrel — the import is the direct
 * `@/lib/format` path (`@/*` → `./src/*`).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * The star color resolves to the `--color-star` token (`#F59E0B`) via the
 * Tailwind `text-star` utility; the keyboard focus ring resolves to
 * `--border-accent` via `ring-[var(--border-accent)]`; the focus-ring corner
 * uses `rounded-badge`. There are NO raw hex / rgba color literals. The numeric
 * `size` is a PROP value (the consumer's chosen px glyph size, not a baked-in
 * design literal) applied via `style={{ fontSize: size }}`, which the AAP
 * explicitly permits. `w-1/2` (the 50% half-star clip / hit-zone split) and the
 * `z`/inset utilities are layout values that carry no color information.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Glyphs are unicode TEXT (AAP §0.3.4) — no image/SVG assets — and are
 *   `aria-hidden` so a screen reader announces the control's value, not five
 *   stray "star" glyphs.
 * • Display mode exposes `role="img"` with an `aria-label` carrying the numeric
 *   rating (e.g. "Rating: 4.5 out of 5 stars").
 * • Editable mode is a `role="slider"` (the standard single-thumb pattern):
 *   focusable (`tabIndex=0`), arrow keys adjust by 0.5, Home/End jump to 0/5,
 *   `aria-valuemin/max/now` + `aria-valuetext` describe the value, and a
 *   `:focus-visible` ring (keyboard-only, per UI3) makes focus visible. Pointer
 *   users get two half-width hit zones per star for 0.5-increment clicks.
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/library/
 * delegates.py` — `RatingDelegate.displayText` calls `rating_to_stars(value,
 * is_half_star, star='★', half='⯨')`, confirming the 5-star / half-star model.
 * Nothing is imported or translated from the Python codebase.
 *
 * @see src/lib/format.ts — `getStarFill` / `StarFill` (the fill-math contract).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useState } from 'react';
import type { JSX, KeyboardEvent } from 'react';

import { getStarFill, type StarFill } from '@/lib/format';

/**
 * Props for {@link StarRating}.
 *
 * Exactly the AAP §0.3.3 contract — a value, an optional editable flag with its
 * change callback, an optional glyph size, and an optional `className` for
 * parent-supplied layout.
 */
export interface StarRatingProps {
  /** The rating to render: 0–5, ideally in 0.5 increments (`Book.rating`). */
  value: number;
  /**
   * When `true`, renders the interactive (clickable / keyboard) variant that
   * previews on hover and commits via {@link StarRatingProps.onChange}. When
   * falsey, renders the read-only display variant.
   * @default false
   */
  editable?: boolean;
  /**
   * Called with the newly chosen rating (a 0.5-increment value in `[0, 5]`)
   * when the user clicks a half-star hit zone or adjusts via the keyboard.
   * Only fires while {@link StarRatingProps.editable} is `true`.
   */
  onChange?: (value: number) => void;
  /**
   * Glyph size in px (drives `font-size`). The detail-panel default is 14; the
   * Metadata Editor passes 20 (left column) or 24 (in-grid picker).
   * @default 14
   */
  size?: number;
  /**
   * Optional extra classes, merged AFTER the base classes so caller utilities
   * win on conflicts (e.g. parent-supplied alignment / margins).
   */
  className?: string;
}

/**
 * Solid star glyph — U+2605 BLACK STAR (`★`). Declared as an explicit unicode
 * escape so the exact codepoint is unambiguous and encoding-independent.
 */
const STAR_FULL = '\u2605';

/**
 * Hollow star glyph — U+2606 WHITE STAR (`☆`). The matched outline companion of
 * {@link STAR_FULL}: identical glyph metrics, so the half-star overlay aligns.
 */
const STAR_EMPTY = '\u2606';

/*
 * BLITZY [TYPOGRAPHY]: `★` (U+2605) / `☆` (U+2606) are NOT present in Inter, so
 * — per AAP §0.3.4, which mandates the rating be rendered as unicode TEXT glyphs
 * "via the font, not as asset files" (0 binary assets) — they are drawn by the
 * platform's symbol-font fallback. That fallback's intrinsic glyph advance can
 * differ slightly from the font Figma's own renderer substitutes (measured
 * ≈0.9em here vs Figma's ≈1.05em at the same font-size), so the rendered glyph
 * ink/advance may be marginally narrower than the Figma node's pixel box at an
 * identical font-size. Everything token-controlled matches Figma EXACTLY — hue
 * (--color-star #F59E0B), the `size` font-size (14px default / 20px metadata),
 * letter-spacing 0, line-height normal, and the single baseline. This residual
 * is a cross-renderer font-substitution metric, not a token/CSS error, and is
 * intentionally NOT "fixed" by shipping a star webfont (AAP §0.3.4 forbids the
 * asset, and a pinned font would not match every end-user platform regardless).
 * If exact cross-renderer ink parity is ever required, pin a star-glyph font
 * whose ★/☆ advance is ≈1.05em — a design-system decision, out of scope here.
 */

/**
 * Base classes for the row container (both variants): an inline flex row of
 * stars, vertically centered, `leading-[normal]` (CSS `line-height: normal`) so
 * the line box reproduces Figma's "Auto" line-height — the rating TEXT nodes
 * carry Auto (≈1.21×, e.g. the detail-panel 14px node's 74×17 box, the 11px
 * table rows' 58×13 box). Pinning `normal` explicitly (rather than inheriting)
 * keeps the box deterministic wherever the primitive is mounted. The half-star
 * overlay stays aligned because the hollow base and the clipped solid star share
 * the SAME font-size and line-height, so any half-leading shifts both glyphs
 * identically. `select-none` keeps the decorative glyphs from being
 * text-selected during interaction, and the amber `text-star` token is inherited
 * by every glyph. NO gap utility — the per-star wrappers sit flush so their
 * advance reproduces the Figma single-string spacing (letter-spacing 0).
 */
const ROW_BASE_CLASSES = 'inline-flex items-center leading-[normal] select-none text-star';

/**
 * Extra row classes applied ONLY in editable mode: a pointer affordance and a
 * keyboard-only focus ring (token-backed `--border-accent`), with the ring
 * corner rounded via `rounded-badge`. `outline-none` removes the default UA
 * outline in favor of the token ring (shown for keyboard users via
 * `:focus-visible`, never on mouse click — UI3).
 */
const ROW_EDITABLE_CLASSES =
  'cursor-pointer rounded-badge outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--border-accent)]';

/** The five star positions (stable keys; the list never reorders). */
const STAR_POSITIONS = [0, 1, 2, 3, 4] as const;

/** Rating domain bounds (0–5), used for keyboard clamping. */
const MIN_RATING = 0;
const MAX_RATING = 5;

/** Keyboard step (the design's 0.5-increment granularity). */
const RATING_STEP = 0.5;

/**
 * StarGlyph — renders a SINGLE star in one of the three fill states. Color is
 * inherited from the row's `text-star`; font-size is inherited from the row's
 * `style={{ fontSize }}`. The glyph is `aria-hidden` (the row owns the
 * accessible value).
 *
 * - `full`  → solid `★`.
 * - `empty` → hollow `☆`.
 * - `half`  → a hollow `☆` base with a 50%-clipped solid `★` layered on top
 *   (`absolute top-0 start-0 w-1/2 overflow-hidden`), giving a crisp half fill;
 *   both layers are the same amber `currentColor`.
 *
 * @param props.fill - The fill state for this star.
 * @returns The rendered single-star glyph.
 */
function StarGlyph({ fill }: { fill: StarFill }): JSX.Element {
  if (fill === 'full') {
    return <span aria-hidden="true">{STAR_FULL}</span>;
  }

  if (fill === 'empty') {
    return <span aria-hidden="true">{STAR_EMPTY}</span>;
  }

  // 'half' — clipped-overlay technique: the hollow base defines the box, and the
  // absolutely-positioned solid star is clipped to the inline-start 50%. Using
  // logical `start-0` makes the fill follow the writing direction (LTR fills
  // from the left, RTL from the right).
  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className="block">{STAR_EMPTY}</span>
      <span className="absolute top-0 start-0 block w-1/2 overflow-hidden">
        {STAR_FULL}
      </span>
    </span>
  );
}

/**
 * StarRating — the bespoke design-system amber star-rating primitive.
 *
 * Renders five stars whose fill states come from `getStarFill(effective)` (the
 * shared, SSR-deterministic helper). In display mode the `effective` rating is
 * simply `value`; in editable mode it is the hover preview when hovering, else
 * `value`. The caller `className` is merged AFTER the base classes so caller
 * utilities win.
 *
 * @param props - {@link StarRatingProps}
 * @returns The rendered star-rating control.
 */
export function StarRating({
  value,
  editable = false,
  onChange,
  size = 14,
  className,
}: StarRatingProps): JSX.Element {
  // Hover preview (editable only). `null` = not hovering → show the real value.
  // Initialising to `null` keeps the first render equal to the display render,
  // so the client hydration matches the server output (no hydration warning).
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  // The rating that actually drives the glyphs. `getStarFill` centralizes the
  // clamp + half-star math for BOTH the display value and the hover preview.
  const effective = editable && hoverValue !== null ? hoverValue : value;
  const fills = getStarFill(effective);

  // Compose row classes: base + (editable extras) + caller className (last so it
  // wins). `filter(Boolean)` drops empty/absent entries before joining.
  const rowClassName = [
    ROW_BASE_CLASSES,
    editable ? ROW_EDITABLE_CLASSES : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // -------------------------- Display variant ----------------------------
  if (!editable) {
    return (
      <span
        className={rowClassName}
        style={{ fontSize: size }}
        role="img"
        aria-label={`Rating: ${value} out of 5 stars`}
      >
        {fills.map((fill, index) => (
          <span
            key={STAR_POSITIONS[index]}
            className="relative inline-block leading-[normal]"
          >
            <StarGlyph fill={fill} />
          </span>
        ))}
      </span>
    );
  }

  // -------------------------- Editable variant ---------------------------

  /**
   * Keyboard handler (slider semantics): Arrow Right/Up raise by 0.5, Arrow
   * Left/Down lower by 0.5, Home/End jump to 0/5. Movement is clamped to
   * `[0, 5]`; `onChange` fires only when the value actually changes.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(MAX_RATING, value + RATING_STEP);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(MIN_RATING, value - RATING_STEP);
        break;
      case 'Home':
        next = MIN_RATING;
        break;
      case 'End':
        next = MAX_RATING;
        break;
      default:
        return; // Ignore other keys (let them bubble normally).
    }

    // Prevent the page from scrolling on the arrow / Home / End keys we handle.
    event.preventDefault();

    if (next !== value) {
      onChange?.(next);
    }
  };

  return (
    <span
      className={rowClassName}
      style={{ fontSize: size }}
      role="slider"
      tabIndex={0}
      aria-label="Rating"
      aria-valuemin={MIN_RATING}
      aria-valuemax={MAX_RATING}
      aria-valuenow={value}
      aria-valuetext={`${value} of 5 stars`}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoverValue(null)}
    >
      {fills.map((fill, index) => {
        // Two half-width hit zones per star give 0.5-increment selection:
        // the inline-start half sets x.5, the inline-end half sets x.0.
        const leftValue = index + RATING_STEP; // 0.5, 1.5, …, 4.5
        const rightValue = index + 1; // 1, 2, …, 5

        return (
          <span
            key={STAR_POSITIONS[index]}
            className="relative inline-block leading-[normal]"
          >
            <StarGlyph fill={fill} />

            {/* Inline-start half → x.5 (decorative; the slider owns a11y). */}
            <span
              className="absolute inset-y-0 start-0 z-10 w-1/2 cursor-pointer"
              aria-hidden="true"
              onMouseEnter={() => setHoverValue(leftValue)}
              onClick={() => onChange?.(leftValue)}
            />
            {/* Inline-end half → x.0. */}
            <span
              className="absolute inset-y-0 end-0 z-10 w-1/2 cursor-pointer"
              aria-hidden="true"
              onMouseEnter={() => setHoverValue(rightValue)}
              onClick={() => onChange?.(rightValue)}
            />
          </span>
        );
      })}
    </span>
  );
}

export default StarRating;
