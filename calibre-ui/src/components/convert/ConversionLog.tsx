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
 * Tailwind CSS v4 CSS-first tokens). It renders the dark, scrollable "terminal"
 * inset that sits inside the Convert dialog body — a monospace stack of
 * colour-coded log lines (grey info, green success, amber warning) that
 * SIMULATE the verbose output of an e-book conversion pipeline.
 *
 * UI-ONLY / MOCK — NO REAL CONVERSION
 * --------------------------------------------------------------------------
 * Nothing here runs a conversion. Every line is STATIC, ORIGINAL, hardcoded
 * mock text (no copyrighted content). There is no file I/O, no EPUB parsing,
 * no spawned process, and no timer — the output is fully deterministic, so the
 * dialog mounts with zero console errors and zero hydration warnings. Design-
 * parity reference ONLY (never imported or translated): `src/calibre/gui2/
 * convert/gui_conversion.py`, whose `gui_convert()` appends a `('verbose', 2)`
 * recommendation and runs `Plumber(input, output, log, …).run()`; that verbose
 * Plumber output is the visual model for these lines — no Python is reused.
 *
 * RENDERING MODEL — PRESENTATIONAL, NO `'use client'`
 * --------------------------------------------------------------------------
 * This component holds no state, runs no hooks, and binds no event handlers,
 * so it deliberately carries NO `'use client'` directive. It is rendered inside
 * the client `ConvertDialog`; a directive-less component with no server-only
 * code is bundled into the client graph without error.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOUR resolves to an `@theme` token declared in `src/app/globals.css`,
 * consumed through a Tailwind v4 utility (`text-text-muted`,
 * `text-format-epub`, `text-star`) or a CSS-variable arbitrary value
 * (`bg-[var(--color-code-bg)]`, `border-[var(--border-white-07)]`). There are
 * NO raw hex/rgba colour literals in this file (the only non-token literals are
 * geometric/layout utilities — flex/gap, padding, max-height, the radius token
 * `rounded-control`, line-height — and the `font-mono` keyword). The exact
 * pixel geometry (per-line gap, scroll-area bottom inset, max-height) is itself
 * read from the named `--space-conversion-log-*` / `--size-conversion-log-*`
 * tokens, which globals.css declares specifically for this component.
 *
 * DESIGN MAPPING (AAP §0.3.1 / §0.3.2 · agent brief §2/§4/§8)
 * --------------------------------------------------------------------------
 * Reproduces the App 05 "terminal-style conversion log (grey/green/amber
 * lines)" exactly per the authoritative token manifest:
 *   • Terminal surface  → `--color-code-bg` (the dark code/terminal surface),
 *     a near-black inset that reads as a true terminal against the lighter
 *     `--color-surface-2` dialog body.
 *   • Grey / info lines    → `--color-text-muted`.
 *   • Green / success lines→ `--color-format-epub`.
 *   • Amber / warning lines→ `--color-star`.
 *   • Monospace family     → the `font-mono` stack (matching the App 04 code
 *     surface), at the `--text-meta-label` (10px / 400) size token.
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.4 — Figma analysis, token & component manifests.
 */

import type { ReactNode } from 'react';

/**
 * Severity of a single conversion-log line. Drives the line's text-colour
 * token (see {@link LEVEL_TEXT_CLASS}):
 *   • `'info'`    → grey  (`--color-text-muted`)   — standard pipeline progress.
 *   • `'success'` → green (`--color-format-epub`)  — a completed/positive step.
 *   • `'warning'` → amber (`--color-star`)         — a non-fatal advisory.
 */
export type LogLevel = 'info' | 'success' | 'warning';

/**
 * A single line in the conversion log.
 */
export interface ConversionLogLine {
  /** Severity of the line, mapped to a colour token via {@link LEVEL_TEXT_CLASS}. */
  level: LogLevel;
  /** The (original, mock) line text. Rendered verbatim. */
  text: string;
  /**
   * Optional leading prefix rendered before {@link ConversionLogLine.text} in
   * the same line colour — e.g. a status glyph ("✓", "⚠") or a STATIC timestamp
   * ("[12:04:01]"). Keep ORIGINAL/mock and constant (never a live clock value,
   * so rendering stays deterministic). Omit for plain progress lines.
   */
  prefix?: string;
}

/**
 * Props for {@link ConversionLog}.
 */
export interface ConversionLogProps {
  /**
   * Lines to render. When omitted, the built-in deterministic
   * {@link DEFAULT_LOG} is rendered.
   */
  lines?: ConversionLogLine[];
  /** Extra classes merged AFTER the base container classes. */
  className?: string;
}

/**
 * The built-in mock log — an ORIGINAL, non-copyrighted reproduction of a
 * verbose conversion run, ordered like a real pipeline: grey `info` progress
 * lines, occasional amber `warning` advisories, and green `success` lines at
 * the end. Static and deterministic (no real pipeline, no clock), so the dialog
 * mounts with zero console/hydration warnings.
 *
 * Conceptually mirrors the verbose `Plumber` output that Calibre's
 * `gui_convert()` produces at log level `('verbose', 2)` — modelled visually
 * only; no Calibre code is used.
 */
export const DEFAULT_LOG: ConversionLogLine[] = [
  { level: 'info', text: 'Initializing conversion pipeline…' },
  { level: 'info', text: 'InputFormatPlugin: EPUB Input running' },
  { level: 'info', text: 'Parsing all content…' },
  { level: 'info', text: 'Resolving CSS and inlining styles…' },
  { level: 'warning', text: 'Some CSS rules could not be parsed and were skipped' },
  { level: 'info', text: 'Running transforms on e-book…' },
  { level: 'info', text: 'Generating manifest and spine…' },
  { level: 'warning', text: 'Empty table of contents — using heuristic chapter detection' },
  { level: 'info', text: 'OutputFormatPlugin: EPUB Output running' },
  { level: 'info', text: 'Creating EPUB Output…' },
  { level: 'success', text: 'Conversion completed successfully' },
  { level: 'success', text: 'Output saved to library' },
];

/**
 * Maps each {@link LogLevel} to its Tailwind text-colour utility, each backed
 * by an `@theme` token. Centralised so the mapping stays token-only and its key
 * type is derived from {@link LogLevel} (map and union can never drift apart):
 *
 *   info    → text-text-muted    (--color-text-muted)
 *   success → text-format-epub   (--color-format-epub)
 *   warning → text-star          (--color-star)
 */
const LEVEL_TEXT_CLASS: Record<LogLevel, string> = {
  info: 'text-text-muted',
  success: 'text-format-epub',
  warning: 'text-star',
};

/**
 * Base classes for the terminal/inset container:
 *   • flex flex-col gap-[var(--space-conversion-log-gap)]
 *                                       → vertical stack with the 3px per-line
 *                                         gap token (combined with the 12px line
 *                                         box → a compact terminal line pitch)
 *   • w-full                            → fill the dialog body width (responsive;
 *                                         no fixed px width → no horizontal overflow)
 *   • bg-[var(--color-code-bg)]         → the dark code/terminal surface token
 *   • border border-[var(--border-white-07)]
 *                                       → 1px white-7% hairline (box-border is set
 *                                         globally, so the border never grows the box)
 *   • rounded-control                   → 8px radius (--radius-control)
 *   • px-2.5 pt-2 pb-[var(--space-conversion-log-pb)]
 *                                       → comfortable inline + top padding, with the
 *                                         5px scroll-area bottom-inset token
 *   • max-h-[var(--size-conversion-log-max-h)] overflow-y-auto
 *                                       → 140px max-height (node 6:88); scrolls when
 *                                         the log is long, keeping the 880×740 dialog
 *                                         free of vertical clipping
 *   • font-mono text-meta-label leading-3
 *                                       → monospace family · 10px/400 size token ·
 *                                         12px line box (inherited by every line)
 */
const CONTAINER_BASE =
  'flex flex-col gap-[var(--space-conversion-log-gap)] w-full ' +
  'bg-[var(--color-code-bg)] border border-[var(--border-white-07)] rounded-control ' +
  'px-2.5 pt-2 pb-[var(--space-conversion-log-pb)] ' +
  'max-h-[var(--size-conversion-log-max-h)] overflow-y-auto ' +
  'font-mono text-meta-label leading-3';

/**
 * Per-line classes: `break-words` (`overflow-wrap: break-word`) so an
 * unexpectedly long caller-supplied line wraps inside the inset instead of
 * forcing horizontal overflow. The per-line colour token is prepended at render.
 */
const LINE_BASE = 'break-words';

/**
 * ConversionLog — the terminal-style conversion-log inset of the App 05 Convert
 * Books dialog (Figma `6:9`).
 *
 * Renders a scrollable dark surface containing one colour-coded row per log
 * line. Pure & deterministic: given the same `lines` it always renders
 * identical markup (no randomness, no clock), so it is hydration-safe. When
 * `lines` is omitted it renders {@link DEFAULT_LOG}.
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
