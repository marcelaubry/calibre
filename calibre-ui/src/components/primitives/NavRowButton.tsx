'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — NavRowButton
 * The shared interactive primitive for left-aligned, selectable LIST/NAV rows.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `NavRowButton` is a bespoke design-system primitive (AAP §0.3.3 / §0.4.2)
 * for the UI-only Calibre e-book-manager prototype (Next.js 15 App Router ·
 * React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens). It is the
 * ONE interactive control used wherever a screen renders a left-aligned,
 * full-width, SELECTABLE row that a raw `<button>` would otherwise be:
 *   • the App 04 EPUB Editor file-tree rows (`FileTreeNode`, Figma `5:53`),
 *   • the App 03 Viewer Table-of-Contents chapter rows (Figma `4:23`),
 *   • the App 06 Preferences category / sub-item rows (Figma `8:15`).
 * These rows share one interaction contract — a clickable, keyboard-operable
 * row that marks the current selection with `aria-current` and a translucent
 * purple fill — but they differ in layout (icon + name + size, icon + label, a
 * single truncating title), height, and indent. They are NOT the centered,
 * `label`-only `Button` primitive (whose four variants — primary/secondary/
 * danger/toolbar — model action CTAs), so this primitive standardizes the
 * row-button SEMANTICS while leaving per-context LAYOUT/typography/active-fill
 * to each consumer's `className`. Screen code must NEVER hand-roll a raw
 * `<button>` for such rows; it always composes this primitive (AAP §0.9 / R4).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * It renders a real, interactive `<button>` that binds an `onClick` handler, so
 * it is a Client Component (App Router components default to Server Components,
 * which cannot attach event handlers). The directive is the very first line,
 * before any import.
 *
 * RENDERING MODEL
 * --------------------------------------------------------------------------
 * Stateless and hook-free. Renders a single real `<button type="button">`.
 * The class string is `BASE_CLASSES` (the variant-invariant row semantics) +
 * any caller `className` (merged last so caller utilities win on conflicts,
 * Tailwind source order governing). The `active` prop drives `aria-current`;
 * `disabled` is forwarded natively AND guarded defensively so `onClick` can
 * never fire while disabled (used for non-interactive folder rows). All
 * remaining native button attributes (`title`, `aria-*`, `data-*`, `id`,
 * `style`, …) are forwarded via `...rest`; the explicit `type` / `disabled` /
 * `aria-current` / `onClick` / `className` are applied AFTER the spread so they
 * always take effect.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * The only styling this primitive owns is the variant-invariant base: a
 * full-width, left-aligned, selectable surface with a token-backed
 * `:focus-visible` ring (the `--border-accent` token, consumed via the
 * `ring-[var(--border-accent)]` arbitrary value) shown for keyboard users only,
 * a `motion-safe` color transition (UI6 / prefers-reduced-motion), and a
 * not-clickable cursor when disabled. There are NO hex / rgba / px literals —
 * the only bare values are layout keywords (`w-full`, `text-left`,
 * `cursor-pointer`, `select-none`) that carry no design-token information. Each
 * consumer supplies its own token-backed color/typography/fill via `className`
 * (e.g. `bg-accent/10`, `text-accent-light`, `text-body`), so the rendered
 * pixels stay 1:1 with each row's Figma node.
 *
 * ACCESSIBILITY (UI3 — invisible, always applied)
 * --------------------------------------------------------------------------
 * • Renders a real, keyboard-operable `<button>` (Space/Enter for free) — never
 *   a `div`-with-onClick.
 * • `active` sets `aria-current="true"` so assistive tech announces the current
 *   selection, never relying on color alone.
 * • The `:focus-visible` ring is visible for keyboard users only (invisible at
 *   rest, DS2-e), and is Figma-neutral (it never alters the resting render).
 * • Non-interactive rows pass `disabled`, which removes them from the tab order
 *   and suppresses activation without dimming their appearance.
 *
 * @see src/components/primitives/Button.tsx — the centered ACTION primitive (CTAs).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.3 / §0.4.2 / §0.9 — component manifest & R4.
 */

import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';

/**
 * Props for {@link NavRowButton}.
 *
 * Extends the native `<button>` attribute set (so `title`, `aria-*`, `data-*`,
 * `id`, `style`, … are all forwarded via `...rest`) EXCEPT `onClick`, which is
 * re-declared below with a simpler, argument-free signature suited to this
 * UI-only prototype's mock interactions.
 */
export interface NavRowButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Marks this row as the current selection. When `true`, sets
   * `aria-current="true"` (the consumer supplies the matching active fill /
   * label color via {@link NavRowButtonProps.className}).
   * @default false
   */
  active?: boolean;
  /**
   * When `true`, removes the row from the tab order, applies a not-clickable
   * cursor, and suppresses `onClick` (both natively, via the `disabled`
   * attribute, and defensively, via the click guard) — e.g. inert folder rows.
   * The row is NOT dimmed (no opacity change), matching the file-tree design.
   * @default false
   */
  disabled?: boolean;
  /** Click handler. Never fires while {@link NavRowButtonProps.disabled} is `true`. */
  onClick?: () => void;
  /**
   * Per-context layout / typography / active-fill classes, merged AFTER the
   * variant-invariant base so caller utilities win on conflicts.
   */
  className?: string;
  /** Row content — e.g. an icon glyph, a label, and a trailing size. */
  children: ReactNode;
}

/**
 * Variant-invariant row semantics shared by every NavRowButton (see file
 * header). Layout-AGNOSTIC: it imposes neither `flex` nor `block`, so each
 * consumer chooses its own row layout (`flex items-center gap-2` for the
 * file-tree / preferences rows, `block truncate` for a single-line TOC title).
 *
 * - Surface: `w-full text-left` — a full-width, left-aligned row.
 * - Affordance: `cursor-pointer` (overridden to default when disabled),
 *   `select-none` so the row label is not text-selected on click.
 * - Focus: a token-backed inset `:focus-visible` ring (`--border-accent`),
 *   shown for keyboard users only — never on mouse click (UI3).
 * - Motion: `motion-safe:transition-colors` animates active/hover color changes
 *   only when the user has NOT requested reduced motion (UI6).
 */
const BASE_CLASSES =
  'w-full text-left cursor-pointer select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
  'focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out ' +
  'disabled:cursor-default';

/**
 * NavRowButton — the bespoke design-system selectable-row primitive.
 *
 * @param props - {@link NavRowButtonProps}
 * @returns The rendered row button element.
 */
export function NavRowButton({
  active = false,
  disabled = false,
  onClick,
  className,
  children,
  ...rest
}: NavRowButtonProps): JSX.Element {
  // Compose token-backed base + caller className (appended last so its
  // utilities win on conflicts). `filter(Boolean)` drops a missing className.
  const merged = [BASE_CLASSES, className].filter(Boolean).join(' ');

  // Defensive click guard. The native `disabled` attribute already suppresses
  // click events; short-circuiting here guarantees the handler can never run
  // while disabled (e.g. an inert folder row).
  const handleClick = (): void => {
    if (disabled) {
      return;
    }
    onClick?.();
  };

  return (
    <button
      {...rest}
      type="button"
      disabled={disabled}
      aria-current={active ? 'true' : undefined}
      onClick={handleClick}
      className={merged}
    >
      {children}
    </button>
  );
}

export default NavRowButton;
