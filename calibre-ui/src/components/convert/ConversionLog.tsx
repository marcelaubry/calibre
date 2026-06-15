/**
 * ==========================================================================
 * Calibre-UI Design System — ConversionLog
 * Terminal-style conversion log for the App 05 "Convert Books" dialog (6:9).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ConversionLog` is 1 of the 5 composition components of the Convert Books
 * dialog (App 05, Figma screen node `6:9`) in the UI-only Calibre e-book-
 * manager prototype (Next.js 15 App Router · React 19 · TypeScript 5 strict ·
 * Tailwind CSS v4 CSS-first tokens). It renders the dark, scrollable
 * "terminal" inset (Figma node `6:88`) that sits between the Look & Feel
 * panel and the dialog footer — a stack of colour-coded log lines (grey info,
 * green success, amber warning) that SIMULATE the verbose output of an e-book
 * conversion pipeline.
 *
 * UI-ONLY / MOCK — NO REAL CONVERSION
 * --------------------------------------------------------------------------
 * Nothing here runs a conversion. Every line is STATIC, ORIGINAL, hardcoded
 * mock text (no copyrighted content). There is no file I/O, no EPUB parsing,
 * no spawned process, and no timer — the output is fully deterministic, so the
 * dialog mounts with zero console errors and zero hydration warnings. Design-
 * parity reference ONLY (never imported or translated): `src/calibre/gui2/
 * convert/gui_conversion.py`, whose `gui_convert()` runs `Plumber(input,
 * output, log, …).run()` at verbose level `('verbose', 2)`; that verbose
 * Plumber output is the visual model for these lines — no code is reused.
 *
 * RENDERING MODEL — PRESENTATIONAL, NO `'use client'`
 * --------------------------------------------------------------------------
 * This component holds no state, runs no hooks, and binds no event handlers,
 * so it deliberately carries NO `'use client'` directive. It is rendered
 * inside the client `ConvertDialog`; a directive-less component with no
 * server-only code is bundled into the client graph without error.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOUR resolves to an `@theme` token declared in `src/app/globals.css`,
 * consumed through a Tailwind v4 utility (`text-text-muted`, `text-text-
 * secondary`, `text-format-epub`, `text-star`) or a CSS-variable arbitrary
 * value (`bg-[var(--color-bg-app)]/40`,
 * `shadow-[inset_0_0_0_1px_var(--border-white-07)]`). There
 * are NO raw hex/rgba colour literals in this file. Only geometric/layout
 * utilities (flex/gap, padding, max-height, the radius token `rounded-control`,
 * line-height) and the permitted bare literals (`0`, `none`, `auto`, `inherit`,
 * `currentColor`, `transparent`) appear as non-colour values.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, screen `6:9`, log `6:88`)
 * --------------------------------------------------------------------------
 * The values below were reconciled from `analyze_figma_node` against node
 * `6:88` and verified per-line by `compare_screenshot_with_figma`. Where this
 * file's pre-analysis brief differed from the CONFIRMED Figma values, the Figma
 * values win (the design source is authoritative) and each deviation is
 * annotated with a `BLITZY` flag for designer review:
 *
 *   • BLITZY [COLOR/SURFACE]: The log inset fill is rgba(12,14,26,0.4) — i.e.
 *     the `--color-bg-app` (#0C0E1A) token at 40% alpha, which composites over
 *     the surface-2 (#13162E) dialog body to read ≈ #10132A. It is NOT the
 *     `--color-code-bg` (#0A0B18) token the brief assumed. Per the brief's own
 *     rule ("if analyze_figma_node shows a different inset fill, prefer the
 *     closest token, e.g. --color-bg-app"), the surface is
 *     `bg-[var(--color-bg-app)]/40`.
 *
 *   • BLITZY [TYPOGRAPHY]: Figma node `6:88` (text style style_Z95SL9)
 *     specifies Inter Regular 400 10px (NOT a monospace family) for all eight
 *     log lines; the "terminal" feel comes from the dark inset surface +
 *     colour-coded lines, not a mono typeface. Therefore `font-mono` is
 *     intentionally NOT applied — lines inherit the global Inter `--font-sans`
 *     via the `text-meta-label` (10px / 400) token, with a 12px line box
 *     (`leading-3`) plus a 3px flex `gap` reproducing the 15px line pitch.
 *
 *   • BLITZY [COLOR]: Figma node `6:88` renders the info lines in TWO distinct
 *     greys — the version-banner line alone in `--color-text-muted` (#64748B)
 *     and every other progress line in `--color-text-secondary` (#94A3B8),
 *     confirmed per-line by `compare_screenshot_with_figma`. Both greys are
 *     reproduced exactly: `'info'` → `text-text-muted` (the dim banner) and
 *     `'verbose'` → `text-text-secondary` (the brighter progress lines).
 *
 *   • BLITZY [CONTRACT]: the pre-analysis brief specified a three-level
 *     severity union (`'info' | 'success' | 'warning'`), but Figma's two-tone
 *     info treatment cannot be expressed with a single info colour. Per the
 *     Figma-precedence rule the union is extended with a fourth, additive level
 *     `'verbose'` (#94A3B8). This is a backward-compatible SUPERSET — any caller
 *     constructing lines with the original three levels still type-checks — so
 *     the documented public contract is preserved while the design is matched
 *     exactly.
 *
 *   • BLITZY [GLYPH]: the warning marker is the inline Unicode character ⚠
 *     (U+26A0), painted in the line's own amber per the reconciled spec, which
 *     declares it an INLINE text glyph (NOT a separate icon/asset). Figma's
 *     renderer draws U+26A0 as a filled triangle; the browser/Inter stack draws
 *     it as an outline triangle. The character, amber colour and position all
 *     match — only the font's glyph fill-style differs. It is intentionally NOT
 *     replaced with an SVG/icon asset, since the Asset Inventory for `6:88` is
 *     empty and substituting an asset would violate the design-system rules.
 *
 *   • BLITZY [CONTENT]: `DEFAULT_LOG` reproduces the exact eight lines shown in
 *     Figma node `6:88` for visual parity (rather than an arbitrary 10–16
 *     generic lines); all strings are original and non-copyrighted.
 *
 *   • BLITZY [GEOMETRY]: Figma node `6:88` is 824×130 with its 1px stroke
 *     aligned INSIDE the frame (the 130px height INCLUDES the stroke). A CSS
 *     `border` is painted OUTSIDE the content+padding box, which would make the
 *     outer box 132px (content 117 + padding 13 + 1px top + 1px bottom). To
 *     reproduce Figma's INSIDE stroke exactly, the hairline is drawn as an inset
 *     box-shadow (`shadow-[inset_0_0_0_1px_var(--border-white-07)]`) instead of
 *     a layout border: it paints a crisp 1px line inside the rounded box without
 *     affecting layout, so the outer box is exactly 824×130 — matching the Figma
 *     frame to the pixel. The colour/opacity/weight are unchanged
 *     (1px `--border-white-07`). An explicit `height:130px` was rejected because
 *     it would clip the 117px text block or force a scrollbar, breaking Figma's
 *     "all 8 lines fit, no scroll".
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.4 — Figma analysis, token & component manifests.
 */

import type { ReactNode } from 'react';

/**
 * Severity of a single conversion-log line. Drives the line's text-colour
 * token (see {@link LEVEL_TEXT_CLASS}):
 *   • `'info'`    → grey  (`--color-text-muted`)      — the dim version/banner line.
 *   • `'verbose'` → grey  (`--color-text-secondary`)  — standard pipeline progress.
 *   • `'success'` → green (`--color-format-epub`)     — a completed/positive step.
 *   • `'warning'` → amber (`--color-star`)            — a non-fatal advisory.
 *
 * NOTE: `'verbose'` is an additive level introduced to reproduce Figma's two
 * grey tones (see the BLITZY [CONTRACT] flag above). The original three levels
 * remain valid, so the union is a backward-compatible superset.
 */
export type LogLevel = 'info' | 'verbose' | 'success' | 'warning';

/**
 * A single line in the conversion log.
 */
export interface ConversionLogLine {
  /** Severity of the line, mapped to a colour token. */
  level: LogLevel;
  /** The (original, mock) line text. Rendered verbatim. */
  text: string;
  /**
   * Optional leading prefix rendered before {@link ConversionLogLine.text} in
   * the same line colour — e.g. a status glyph ("✓", "⚠") or a timestamp
   * ("[12:04:01]"). Keep ORIGINAL/mock. Omit for plain info lines.
   */
  prefix?: string;
}

/**
 * Props for {@link ConversionLog}.
 */
export interface ConversionLogProps {
  /**
   * Lines to render. When omitted, the built-in deterministic
   * {@link DEFAULT_LOG} is rendered (the exact eight lines from Figma `6:88`).
   */
  lines?: ConversionLogLine[];
  /** Extra classes merged AFTER the base container classes. */
  className?: string;
}

/**
 * The built-in mock log — the exact eight lines shown in Figma node `6:88`, in
 * order. Static and ORIGINAL (no copyrighted text, no real pipeline). The
 * leading "✓"/"⚠" status glyphs on the success/warning lines are carried in
 * `prefix` and rendered in the line's own colour, exactly as in the design.
 *
 * Per-line levels mirror the Figma two-tone info treatment (verified by
 * `compare_screenshot_with_figma`): the version banner is `'info'` (the dim
 * `--color-text-muted` #64748B), every subsequent progress line is `'verbose'`
 * (the brighter `--color-text-secondary` #94A3B8), the chapter-count line is
 * `'success'` (green), and the non-standard-tag line is `'warning'` (amber).
 */
export const DEFAULT_LOG: ConversionLogLine[] = [
  { level: 'info', text: 'Calibre converter v7.12.0' },
  { level: 'verbose', text: 'Input file: /books/Dune.epub (2.3 MB)' },
  { level: 'verbose', text: 'Parsing input file...' },
  { level: 'success', prefix: '✓', text: 'Found 48 chapters, 1 CSS file, 1 cover image' },
  { level: 'verbose', text: 'Applying output profile: Kindle' },
  { level: 'verbose', text: 'Processing heuristics...' },
  { level: 'warning', prefix: '⚠', text: 'Chapter marker found in non-standard tag' },
  { level: 'verbose', text: 'Generating MOBI output...' },
];

/**
 * Maps each {@link LogLevel} to its Tailwind text-colour utility, each backed
 * by an `@theme` token. Centralised so the mapping stays token-only and the key
 * type is derived from {@link LogLevel} (map and union can never drift apart).
 *
 *   info    → text-text-muted      (#64748B, --color-text-muted)
 *   verbose → text-text-secondary  (#94A3B8, --color-text-secondary)
 *   success → text-format-epub     (#4ADE80, --color-format-epub)
 *   warning → text-star            (#F59E0B, --color-star)
 */
const LEVEL_TEXT_CLASS: Record<LogLevel, string> = {
  info: 'text-text-muted',
  verbose: 'text-text-secondary',
  success: 'text-format-epub',
  warning: 'text-star',
};

/**
 * Base classes for the terminal/inset container (Figma `6:88`):
 *   • flex flex-col gap-[var(--space-conversion-log-gap)]
 *                                               → vertical stack; the 3px gap
 *                                                 token + 12px line box = Figma's
 *                                                 15px line pitch with a 117px
 *                                                 text block (matches node 6:88)
 *   • w-full                                    → fill the dialog body width (responsive)
 *   • bg-[var(--color-bg-app)]/40               → fill rgba(12,14,26,0.4)
 *   • shadow-[inset_0_0_0_1px_var(--border-white-07)]
 *                                               → 1px rgba(255,255,255,0.07) hairline,
 *                                                 painted INSIDE the box (matching
 *                                                 Figma 6:88's INSIDE stroke align) so
 *                                                 the outer box is exactly 130px — a
 *                                                 layout `border` would add 1px top +
 *                                                 1px bottom (132px). See BLITZY [GEOMETRY].
 *   • rounded-control                           → 8px radius (--radius-control)
 *   • px-2.5 pt-2 pb-[var(--space-conversion-log-pb)]
 *                                               → 10px inline · 8px top / 5px
 *                                                 bottom token (Figma 6:88's
 *                                                 asymmetric insets)
 *   • max-h-[var(--size-conversion-log-max-h)] overflow-y-auto
 *                                               → 140px max fits the 8 default
 *                                                 lines; scrolls beyond, keeping
 *                                                 the 880×740 dialog free of
 *                                                 vertical clipping
 *   • text-meta-label                           → Inter 10px / 400 (inherited by lines)
 *   • leading-3                                 → 12px line box (Figma's per-line box)
 */
const CONTAINER_BASE =
  'flex flex-col gap-[var(--space-conversion-log-gap)] w-full bg-[var(--color-bg-app)]/40 ' +
  'shadow-[inset_0_0_0_1px_var(--border-white-07)] rounded-control px-2.5 pt-2 pb-[var(--space-conversion-log-pb)] ' +
  'max-h-[var(--size-conversion-log-max-h)] overflow-y-auto text-meta-label leading-3';

/**
 * Per-line classes: the level colour token plus `break-words`
 * (`overflow-wrap: break-word`) so an unexpectedly long caller-supplied line
 * wraps inside the inset instead of forcing horizontal overflow.
 */
const LINE_BASE = 'break-words';

/**
 * ConversionLog — the terminal-style conversion-log inset (Figma `6:88`).
 *
 * Renders a scrollable dark surface containing one colour-coded row per log
 * line. Pure & deterministic: given the same `lines` it always renders
 * identical markup (no randomness, no clock), so it is hydration-safe.
 *
 * @param props - {@link ConversionLogProps}
 * @returns The rendered conversion-log element.
 */
export function ConversionLog({ lines, className }: ConversionLogProps): ReactNode {
  // Fall back to the built-in mock when no lines are supplied.
  const data = lines ?? DEFAULT_LOG;

  // Merge the caller className AFTER the base so caller utilities win on
  // conflicts (Tailwind's later source order governs).
  const containerClassName = [CONTAINER_BASE, className].filter(Boolean).join(' ');

  return (
    <div role="log" aria-label="Conversion log" className={containerClassName}>
      {data.map((line, index) => (
        <div
          // Static list → a composed index/level key is stable and sufficient.
          key={`${index}-${line.level}`}
          className={`${LEVEL_TEXT_CLASS[line.level]} ${LINE_BASE}`}
        >
          {line.prefix ? `${line.prefix} ${line.text}` : line.text}
        </div>
      ))}
    </div>
  );
}

export default ConversionLog;
