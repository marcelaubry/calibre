'use client';

/**
 * ==========================================================================
 * Calibre-UI Design System — ModalShell
 * The centered modal-dialog SCAFFOLD primitive (scrim + card + chrome).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ModalShell` is one of the 14 bespoke design-system primitives (AAP §0.3.3 /
 * §0.4.2) for the UI-only Calibre e-book-manager prototype (Next.js 15 App
 * Router · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 * It is the single, reusable centered-dialog scaffold that hosts the TWO modal
 * overlays of the app:
 *   • the Convert Books dialog  — App 05, Figma node `6:9` (variant="convert")
 *   • the Metadata Editor       — App 07, Figma node `9:9` (variant="metadata")
 * `ConvertDialog` and `MetadataDialog` (sibling component folders) compose their
 * own content INTO this shell via `children` (and the optional `footer` slot);
 * they NEVER re-implement the scrim, card geometry, header, or close affordance.
 *
 * ROUTE-INDEPENDENT OVERLAY
 * --------------------------------------------------------------------------
 * These modals overlay the dimmed library and DO NOT change the route — they are
 * driven purely by `ModalProvider` open state (App Router stays on `/` or
 * `/grid`). The shell renders a `fixed inset-0` full-viewport overlay, so it
 * floats above all app content regardless of where it is mounted in the tree (no
 * React portal is required, and none is used). When `open` is `false` the
 * component renders `null` and mounts nothing.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Both dialog geometries were reconciled via analyze_figma_node. CONFIRMED:
 *   convert  (card `6:9`, scrim `6:3`):
 *     • card 880×740, radius 16px, fill #13162E (surface-2),
 *       border rgba(255,255,255,0.10) 1px, shadow 0 24px 64px rgba(0,0,0,0.6)
 *     • scrim rgba(12,14,26,0.6), full 1440×900, dialog centered
 *   metadata (card `9:9`, scrim `9:8`):
 *     • card 860×800, radius 16px, fill #13162E (surface-2),
 *       border rgba(255,255,255,0.10) 1px, shadow 0 20px 60px rgba(0,0,0,0.65)
 *     • scrim rgba(0,0,0,0.55), full-viewport, dialog centered
 * Shared chrome CONFIRMED on both cards: a top header band (bg #10132A =
 * surface-1, nodes `6:10`/`9:10`) closed by a 1px rgba(255,255,255,0.07)
 * hairline (`6:11`/`9:11`); a 24×24 close affordance at top-right (`6:14`/`9:18`,
 * fill rgba(255,255,255,0.06)) rendered as the unicode "×" glyph (`6:15`/`9:19`);
 * and a footer band opened by a 1px rgba(255,255,255,0.07) top hairline
 * (`6:97`/`9:120`) holding a right-aligned action row. The card's
 * `overflow-hidden` clips the header band's top corners to the 16px radius
 * (CONFIRMED render behavior).
 *
 * The book-name SUBTITLE seen in the Figma header (`6:13`/`9:13`) and the
 * metadata prev/next step arrows (`9:14`/`9:16`) are CONTENT-specific and belong
 * to the consuming dialog, not this generic scaffold — the contract exposes only
 * `title`, so the shell deliberately does not render them.
 *
 * BLITZY [TYPOGRAPHY]: the Figma header title is Inter 600 16px on both cards,
 * but the design-system role token `--text-dialog-heading` is pinned to 20px
 * (AAP §0.3.2, "pinned 20px (AAP range ~18–22)"), and this primitive's contract
 * (and the zero-hardcoded-token rule below) mandates the `text-dialog-heading`
 * utility. Per the design-token mandate the shell uses `text-dialog-heading`
 * (20px) rather than a hardcoded `text-[16px]`. Flagged for designer review; if
 * a 16px dialog-title token is ever added, swap the one `TITLE` constant.
 *
 * BLITZY [COLOR]: the close "×" glyph fill is #94A3B8 on the convert card
 * (`6:15`) and #64748B on the metadata card (`9:19`). A single reusable shell
 * uses ONE close color; per the contract it is `text-text-muted` (#64748B,
 * exact on metadata, one muted step off on convert) with a `text-text-primary`
 * hover. No per-variant close-color branching is introduced.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / SHADOW / BORDER value resolves to an `@theme` token
 * declared in `src/app/globals.css`, consumed via a Tailwind v4 utility
 * (`bg-surface-2`, `bg-surface-1`, `rounded-dialog`, `rounded-control`,
 * `shadow-convert`, `shadow-metadata`, `text-dialog-heading`, `text-text-primary`,
 * `text-text-muted`) or a CSS-variable arbitrary value
 * (`bg-[var(--scrim-convert)]`, `bg-[var(--scrim-metadata)]`,
 * `border-[var(--border-white-10)]`, `border-[var(--border-white-07)]`,
 * `bg-[var(--border-white-06)]`, `ring-[var(--border-accent)]`). There are NO
 * raw hex / rgba color literals. The only bare literals are LAYOUT / geometry
 * values that carry no color information — the dialog footprint (`w-[880px]`,
 * `h-[740px]`, `w-[860px]`, `h-[800px]`), the close-button size (`h-6`, `w-6`),
 * the stacking keyword (`z-50`), flex/padding/gap utilities, and the allowed
 * transition timings — all permitted (AAP: "Geometric px (w/h) are layout
 * utilities (allowed)").
 *
 * RENDERING MODEL & ACCESSIBILITY (UI3 — invisible a11y, always applied)
 * --------------------------------------------------------------------------
 * Marked `'use client'` (first line) because it owns interactive state: an
 * Escape-key `keydown` listener and a backdrop click both call `onClose`, and a
 * body scroll-lock is toggled — all in a single `useEffect` whose cleanup
 * removes the listener AND restores the prior `document.body.style.overflow` (no
 * scroll-lock leaks). The effect is called UNCONDITIONALLY (before the
 * `open === false → null` early return) to honor the Rules of Hooks, and is
 * internally guarded so it only binds while open.
 *   • The dialog card is a semantic `role="dialog"` with `aria-modal="true"` and
 *     `aria-label={title}`.
 *   • The close control is a real `<button type="button">` with `aria-label`
 *     and a token-backed `:focus-visible` ring (keyboard users only, invisible
 *     at rest — DS2-e); the "×" glyph itself is `aria-hidden`.
 *   • Clicks inside the card `stopPropagation()` so only true backdrop clicks
 *     reach the scrim handler (AAP: "Clicks INSIDE the dialog must NOT bubble").
 *   • Transitions are gated behind `motion-safe:` (UI6 / prefers-reduced-motion).
 *
 * Design-parity reference only (NO code reuse): `src/calibre/gui2/convert/`
 * (gui_conversion.py) and `src/calibre/gui2/metadata/` (single.py) — the Qt
 * dialogs these overlays model. Nothing is imported or translated from the
 * Python codebase.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 / §0.3.3 / §0.4.2 — token & component manifests.
 */

import { useEffect, type JSX, type ReactNode } from 'react';

/**
 * The two dialog geometries this scaffold encodes. Each value selects a matched
 * triplet of scrim color, elevation shadow, and card footprint (see the maps
 * below), reproducing the App 05 (`6:9`) and App 07 (`9:9`) Figma dialogs.
 */
export type ModalVariant = 'convert' | 'metadata';

/**
 * Props for {@link ModalShell} — the exact AAP §0.3.3 contract.
 *
 * Intentionally a CLOSED interface: the shell's inputs are its controlled open
 * state, its accessible title, the close callback, the geometry variant, the
 * body content, and an optional footer action row. All visual treatment is
 * derived internally from design tokens, so there is no `className`/`style`
 * escape hatch (consumers shape their own content via `children`/`footer`).
 */
export interface ModalShellProps {
  /**
   * Controlled visibility. When `false` the component renders `null` (mounts
   * nothing); when `true` it renders the full-viewport scrim + centered dialog.
   */
  open: boolean;
  /**
   * The dialog heading, rendered in the header (`text-dialog-heading`) AND wired
   * as the dialog's accessible name via `aria-label`.
   */
  title: string;
  /**
   * Invoked when the user dismisses the dialog — by pressing Escape, clicking
   * the scrim/backdrop, or activating the header close (✕) button. The parent
   * (`ModalProvider`) owns the actual open state.
   */
  onClose: () => void;
  /**
   * Selects the dialog geometry/shadow/scrim:
   *   • `'convert'`  → 880×740, scrim `--scrim-convert`, `shadow-convert`.
   *   • `'metadata'` → 860×800, scrim `--scrim-metadata`, `shadow-metadata`.
   * @default 'convert'
   */
  variant?: ModalVariant;
  /** The scrollable dialog body — supplied by the consuming dialog component. */
  children: ReactNode;
  /**
   * Optional footer action row (e.g. Cancel · Convert Book, or
   * Cancel · Apply · Save). When provided it is rendered right-aligned beneath a
   * top hairline divider; when omitted the footer band is not rendered at all.
   */
  footer?: ReactNode;
}

/**
 * Scrim/backdrop fill per variant. The scrim tokens are NOT under the
 * `--color-*` namespace (so Tailwind generates no `bg-scrim-*` utility); they
 * are consumed as CSS-variable arbitrary values. CONFIRMED: convert `6:3` =
 * rgba(12,14,26,0.6); metadata `9:8` = rgba(0,0,0,0.55).
 */
const SCRIM_BG: Record<ModalVariant, string> = {
  convert: 'bg-[var(--scrim-convert)]',
  metadata: 'bg-[var(--scrim-metadata)]',
};

/**
 * Card elevation shadow per variant, via the generated `shadow-*` utilities.
 * CONFIRMED: convert = 0 24px 64px rgba(0,0,0,0.6) (`--shadow-convert`);
 * metadata = 0 20px 60px rgba(0,0,0,0.65) (`--shadow-metadata`).
 */
const DIALOG_SHADOW: Record<ModalVariant, string> = {
  convert: 'shadow-convert',
  metadata: 'shadow-metadata',
};

/**
 * Card footprint per variant (CONFIRMED Figma px — layout utilities, not
 * colors). The base classes pair these with `max-w-full max-h-full` so the card
 * never exceeds the padded viewport (the scrim's `p-8` keeps a gutter), holding
 * the 1440 baseline down to ≥1280 with zero horizontal overflow; tall content
 * scrolls inside the body band instead.
 */
const DIALOG_SIZE: Record<ModalVariant, string> = {
  convert: 'w-[880px] h-[740px]',
  metadata: 'w-[860px] h-[800px]',
};

/**
 * Scrim base: a fixed full-viewport, high-stacking flexbox that centers the
 * dialog and pads it off the edges (the `p-8` gutter guarantees the card clears
 * the viewport border at the 1280–1440 widths). The variant scrim fill is
 * appended at render time.
 */
const SCRIM_BASE = 'fixed inset-0 z-50 flex items-center justify-center p-8';

/**
 * Dialog card base (variant-invariant): the glassmorphic surface
 * (`bg-surface-2` #13162E), the 16px `rounded-dialog` radius, and the 1px
 * white-10 hairline border — all CONFIRMED on both `6:9` and `9:9`. Laid out as
 * a vertical flex column with `overflow-hidden` so the header band's top corners
 * clip to the radius and the body (not the card) owns the scroll. The variant
 * size and shadow, plus `max-w-full max-h-full`, are appended at render time.
 */
const DIALOG_BASE =
  'flex max-w-full max-h-full flex-col overflow-hidden ' +
  'bg-surface-2 rounded-dialog border border-[var(--border-white-10)]';

/**
 * Header band: a fixed (`shrink-0`) row holding the title (left) and the close
 * button (right). CONFIRMED chrome — the surface-1 band fill (`6:10`/`9:10`)
 * and the 1px white-7 bottom hairline (`6:11`/`9:11`). `px-5 py-3.5` reproduces
 * the 20px title inset and the ~52px band height.
 */
const HEADER =
  'flex shrink-0 items-center gap-4 ' +
  'bg-surface-1 border-b border-[var(--border-white-07)] px-5 py-3.5';

/**
 * Title typography: the `text-dialog-heading` role (Inter 600) in the primary
 * text token. `min-w-0 flex-1 truncate` lets a long title ellipsize instead of
 * shoving the close button off the card. (See BLITZY [TYPOGRAPHY] in the header.)
 */
const TITLE = 'min-w-0 flex-1 truncate text-dialog-heading text-text-primary';

/**
 * Close button (variant-invariant base): a 24×24 (`h-6 w-6`) rounded square with
 * the CONFIRMED subtle white-6 fill (`6:14`/`9:18`), the muted glyph color
 * (hover → primary), and a keyboard-only token focus ring (matches the house
 * pattern set by `Toggle`). The color change animates only when motion is
 * allowed (UI6). The per-variant border is appended from {@link CLOSE_BORDER}.
 *
 * BLITZY [RADIUS]: Figma specs the close chip at 6px (`6:14`/`9:18`); there is no
 * 6px radius token in the system (the scale is badge 3 / toolbar 7 / control 8 /
 * card 10 / dialog 16). Per the zero-hardcoded rule a `rounded-[6px]` literal is
 * disallowed, so this uses `rounded-control` (8px) — the semantically correct
 * token for an interactive control and within the design system's ±2px silent
 * radius-snapping tolerance (8 − 6 = 2). Documented rather than literalized.
 *
 * BLITZY [GLYPH]: the mark is the "×" U+00D7 MULTIPLICATION SIGN — an exact match
 * for the convert glyph (`6:15`). The metadata source (`9:19`) draws a lowercase
 * ASCII "x"; "×" is the standard, visually-symmetric close mark and satisfies the
 * agent_prompt's "unicode glyph" mandate, so a single glyph serves both variants.
 */
const CLOSE_BTN =
  'grid h-6 w-6 shrink-0 place-items-center rounded-control ' +
  'bg-[var(--border-white-06)] text-text-muted ' +
  'hover:text-text-primary ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-accent)] ' +
  'motion-safe:transition-colors motion-safe:duration-150';

/**
 * Close-button border per variant — a CONFIRMED, deliberately variant-specific
 * detail of the Figma source. The convert close chip (`6:14`) carries a 1px
 * white-9 inside stroke; the metadata close chip (`9:18`) carries NO stroke.
 * With `box-sizing: border-box` (globals.css base layer) the 1px border draws
 * inside the 24×24 footprint, so neither variant shifts the glyph or the chip
 * size. Empty string ⇒ no border utility is emitted for the metadata variant.
 */
const CLOSE_BORDER: Record<ModalVariant, string> = {
  convert: 'border border-[var(--border-white-09)]',
  metadata: '',
};

/**
 * Body band: the single scrollable content slot. `min-h-0` is the flexbox
 * gotcha guard that lets the column child actually shrink and scroll (rather
 * than overflow the card) when content exceeds the available height; `flex-1`
 * makes it absorb the space between the fixed header and footer.
 */
const BODY = 'min-h-0 flex-1 overflow-y-auto';

/**
 * Footer band: a fixed (`shrink-0`) right-aligned action row opened by the
 * CONFIRMED 1px white-7 top hairline (`6:97`/`9:120`). Padding mirrors the
 * header; `gap-3` spaces the action buttons supplied via the `footer` slot.
 */
const FOOTER =
  'flex shrink-0 items-center justify-end gap-3 ' +
  'border-t border-[var(--border-white-07)] px-5 py-3.5';

/**
 * ModalShell — the bespoke centered modal-dialog scaffold primitive.
 *
 * Renders (when `open`) a fixed full-viewport scrim whose backdrop click closes
 * the dialog, centering a token-styled dialog card. The card stops click
 * propagation, declares `role="dialog"`/`aria-modal`/`aria-label`, and lays out
 * a fixed header (title + ✕ close), a scrollable body (`children`), and — when
 * `footer` is provided — a right-aligned footer action row beneath a hairline.
 * Escape closes the dialog and the body scroll is locked while open (both set up
 * and torn down in one effect). When `open` is `false` it renders `null`.
 *
 * @param props - {@link ModalShellProps}
 * @returns The rendered modal overlay, or `null` when closed.
 */
export function ModalShell({
  open,
  title,
  onClose,
  variant = 'convert',
  children,
  footer,
}: ModalShellProps): JSX.Element | null {
  // Escape-to-close + body scroll-lock. Called UNCONDITIONALLY (before the
  // early return below) to honor the Rules of Hooks; the internal `open` guard
  // means nothing is bound while the dialog is closed. The cleanup removes the
  // listener AND restores the exact prior `overflow`, so there are no
  // scroll-lock leaks across open/close cycles or on unmount.
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // Closed → mount nothing. (Hooks above always run, so this early return is
  // Rules-of-Hooks-safe.)
  if (!open) {
    return null;
  }

  // Compose the variant-specific class strings from the token-backed maps.
  // `filter(Boolean)` drops the empty metadata close-border entry so no stray
  // whitespace leaks into the className.
  const scrimClassName = `${SCRIM_BASE} ${SCRIM_BG[variant]}`;
  const dialogClassName = `${DIALOG_BASE} ${DIALOG_SIZE[variant]} ${DIALOG_SHADOW[variant]}`;
  const closeButtonClassName = [CLOSE_BTN, CLOSE_BORDER[variant]]
    .filter(Boolean)
    .join(' ');

  return (
    // Scrim / backdrop — a click anywhere on it (i.e. outside the card) closes.
    <div className={scrimClassName} onClick={onClose}>
      {/* Dialog card. stopPropagation keeps inner clicks from reaching the
          backdrop handler so only true outside clicks dismiss the dialog. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={dialogClassName}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header: title (left, truncating) + close button (right). */}
        <header className={HEADER}>
          <h2 className={TITLE}>{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={closeButtonClassName}
          >
            {/* Decorative glyph; the button's aria-label is the accessible name. */}
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {/* Body: the scrollable content slot filled by the consuming dialog. */}
        <div className={BODY}>{children}</div>

        {/* Footer: optional right-aligned action row beneath a top hairline. */}
        {footer != null ? <footer className={FOOTER}>{footer}</footer> : null}
      </div>
    </div>
  );
}

export default ModalShell;
