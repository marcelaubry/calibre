'use client';

/**
 * ==========================================================================
 * Calibre-UI — ReadingArea (App 03 · Figma node `4:43` in screen `4:2`)
 * The E-book Viewer's central reading surface.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ReadingArea` is the center reading panel of the App 03 E-book Viewer screen
 * (`4:2`) — the 848×824 region (Figma node `4:43`, surface `#0F1020`) that
 * renders the currently-open chapter as a top reading-progress bar, a gradient
 * header divider, the chapter title, and a justified, scalable prose column.
 * It is part of the UI-only, mock-data Calibre prototype (Next.js 15 App Router
 * · React 19 · TypeScript 5 strict · Tailwind CSS v4 CSS-first tokens).
 *
 * WHY THIS IS A CLIENT COMPONENT (`'use client'` — load-bearing)
 * --------------------------------------------------------------------------
 * This file carries the `'use client'` directive because it reads live reading
 * state from the React Context exposed by `@/state/ReaderProvider` via the
 * `useReader()` hook. The displayed chapter, the reading-progress percentage,
 * and the font scale all change in response to user interaction elsewhere in the
 * viewer (the Table of Contents, the Nav Strip's Previous/Next, and the
 * Reader Toolbar's A-/A+ controls), so this surface must run on the client and
 * re-render as that state updates.
 *
 * STATE CONSUMED (read-only — this component mutates nothing)
 * --------------------------------------------------------------------------
 *   • `currentChapter` — the `Chapter` being read (`{ id, title, body,
 *     wordCount }`), or `undefined` when the seeded chapter list is empty. Its
 *     `body` is STRUCTURED static mock content authored in `@/data/chapters`: an
 *     ordered list of paragraphs, each a list of inline runs (`{ text,
 *     highlight? }`); exactly one early chapter carries a single `highlight: true`
 *     run (the highlighted passage).
 *   • `progressPercent` — the 0–100 reading-progress value DERIVED by the
 *     provider from the chapter index (index 2 of 7 ⇒ 29, matching the design's
 *     29% bar). It is bound to the progress-bar fill width and re-renders the bar
 *     whenever the chapter changes.
 *   • `fontScale` — the A-/A+ multiplier (`1` = 100%, clamped to 0.8–1.6). The
 *     reading body's font-size AND line-height are scaled by it (see below).
 * This component imports `useReader` ONLY; it deliberately does NOT read
 * `@/data/chapters` directly (chapters flow through the provider) and does NOT
 * read `usePreferences` — the base reading surface is the dedicated
 * `--color-reading-surface` token regardless of the active viewer theme.
 *
 * RENDERING STRUCTURED CONTENT (NO `dangerouslySetInnerHTML`)
 * --------------------------------------------------------------------------
 * The chapter body is rendered as REAL React elements: each paragraph maps to a
 * `<p>` and each inline run to either a plain text node or, when `highlight` is
 * set, a `<mark>`. There is deliberately NO `dangerouslySetInnerHTML` here — the
 * viewer injects no raw HTML at all, so there is no injection-shaped sink to
 * reason about and nothing to sanitize at runtime. (The ONLY sanctioned raw-HTML
 * sink in the app is the Shiki-rendered `CodeEditor`, whose markup is produced by
 * the highlighter, not by this surface.) The rendered `<p>` and `<mark>`
 * descendants are styled with Tailwind arbitrary descendant variants on the
 * content wrapper (`READER_PROSE`).
 *
 * FONT SCALING (base from token, multiplier from `fontScale`)
 * --------------------------------------------------------------------------
 * The reading body's BASE typography is the `text-reader-body` token (Inter 400,
 * 15px / 26px). The runtime A-/A+ scale is applied as a MULTIPLIER over the token
 * values via inline `calc()`:
 *     font-size:   calc(var(--text-reader-body) * fontScale)
 *     line-height: calc(var(--text-reader-body--line-height) * fontScale)
 * The base values live entirely in the token layer (`globals.css` `@theme`,
 * emitted to `:root` via `@theme static`); the component supplies ONLY the
 * `fontScale` multiplier. `fontScale` is a runtime variable (not a hardcoded
 * design literal) and the provider keeps it on a clean 0.1 grid. The
 * `text-reader-body` utility class is also applied so the body inherits the
 * token's font-weight (400) and degrades to the exact 15px/26px base if the
 * inline calc is ever absent.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / gradient / radius / typography value resolves to an `@theme`
 * token: `bg-reading-surface` (surface), `bg-gradient-accent` (progress fill +
 * gradient divider), `bg-[var(--border-white-07)]` (progress track),
 * `text-detail-title` + `text-text-primary` (chapter title), `text-reader-body`
 * + `text-text-primary` (body), `bg-accent/30` + `text-text-primary` +
 * `rounded-[var(--radius-badge)]` (the `<mark>` highlight), and `text-body` +
 * `text-text-muted` (empty state). There is NO hex/rgba color literal and NO
 * inline color `style`. The ONLY dynamic, non-token values are the runtime
 * `progressPercent` width percentage and the `fontScale` multiplier — both
 * explicitly permitted. The two design-specific geometry values resolve to
 * `@theme` tokens (R3): the progress-bar height via `--size-reading-progress-h`
 * (3px, `h-[var(--size-reading-progress-h)]`) and the readable prose measure via
 * `--size-reading-measure` (680px, `max-w-[var(--size-reading-measure)]`). The
 * remaining bare values (`h-px`, `px-8`, `py-12`, `mb-6`, `mb-5`, `px-0.5`) are
 * Tailwind standard-scale layout utilities, never tokenized color/typography
 * values.
 *
 * RESPONSIVE WIDTH (1440 → 1280, zero horizontal overflow)
 * --------------------------------------------------------------------------
 * The panel is NOT fixed to `w-[848px]`: it is `flex-1 min-w-0` so it absorbs
 * the width the viewer page leaves between the 220px Table of Contents and the
 * 372px Reader Tools panel (848px at the 1440 baseline; ~688px at the 1280
 * minimum). `min-w-0` lets the flex child actually shrink, and the inner prose
 * column is capped at a readable `max-w-[var(--size-reading-measure)]` measure
 * (centered with `mx-auto`), so the surface degrades cleanly with no horizontal
 * scroll. The
 * progress bar + divider form a pinned `flex-none` header band; the body region
 * scrolls vertically (`overflow-y-auto`) beneath it.
 *
 * DESIGN-PARITY REFERENCE ONLY (NO code reuse)
 * --------------------------------------------------------------------------
 * The reading-viewport concept mirrors Calibre's desktop viewer —
 * `src/calibre/gui2/viewer/ui.py` (the `WebView` that renders book content and
 * tracks reading progress). NO Python/Qt code is imported, translated, or
 * executed; only the visual reading surface + a progress indicator are
 * reproduced against in-memory mock data. There is no real EPUB parsing, no file
 * I/O, and no persistence.
 *
 * @see @/state/ReaderProvider — `useReader()` (the reading state consumed here).
 * @see @/data/chapters — the seeded 7-chapter mock dataset (read via the provider).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see src/calibre/gui2/viewer/ui.py — Calibre reading viewport (reference only).
 * @see Agent Action Plan §0.3.1 / §0.3.2 / §0.7.4 (App03 ReadingArea + tokens).
 */

import { Fragment } from 'react';

import { useReader } from '@/state/ReaderProvider';

/**
 * Props for {@link ReadingArea}.
 *
 * No props are required — the component renders entirely from `useReader()`
 * state. An optional `className` is accepted so the composing `/viewer` page can
 * append layout utilities (e.g. an order/flex hint) without the component
 * leaking styling concerns.
 */
export interface ReadingAreaProps {
  /** Optional extra classes appended to the root reading surface. */
  className?: string;
}

/**
 * Tailwind arbitrary-variant styling for the rendered chapter content.
 *
 * Applied to the body content wrapper so the `<p>` / `<mark>` elements rendered
 * from `currentChapter.body` are styled correctly:
 *   • `[&_p:not(:last-child)]:mb-5` — comfortable inter-paragraph rhythm. This is
 *     required because Tailwind's Preflight zeroes the default `<p>` margins; the
 *     `:not(:last-child)` guard avoids a trailing gap after the final paragraph.
 *   • `[&_mark]` — the highlighted passage: a translucent accent wash
 *     (`bg-accent/30`, the design's selection/highlight color) with readable
 *     `text-text-primary` ink, a small `rounded-[var(--radius-badge)]` radius and
 *     `px-0.5` inset for a marker look, and `box-decoration-clone` so a highlight
 *     that wraps across lines keeps its background, padding, and radius on every
 *     line fragment. These override the user-agent default yellow `<mark>`.
 */
const READER_PROSE =
  '[&_p:not(:last-child)]:mb-u20 ' +
  '[&_mark]:bg-accent/30 [&_mark]:text-text-primary ' +
  '[&_mark]:rounded-[var(--radius-badge)] [&_mark]:px-u2 [&_mark]:box-decoration-clone';

/** The base reading-surface root classes (shared by the empty state). */
const SURFACE_ROOT =
  'flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-reading-surface';

/**
 * ReadingArea — the App 03 E-book Viewer's central reading surface (`4:43`).
 *
 * Renders, top → bottom: a pinned reading-progress bar bound to
 * `progressPercent`, a gradient header divider, the chapter title, and the
 * justified prose column whose typography scales with `fontScale`. Reads all
 * state from `useReader()` and mutates nothing.
 *
 * @param props - see {@link ReadingAreaProps}.
 * @returns The rendered reading surface (or a stable empty state when no chapter
 *   is available).
 */
export function ReadingArea({ className }: ReadingAreaProps = {}) {
  const { currentChapter, progressPercent, fontScale } = useReader();

  // Empty-state guard: with no current chapter there is nothing to read, so
  // render the same token surface with a centered muted message. This keeps the
  // viewer layout stable (the panel still occupies its flex slot) and avoids a
  // runtime error from reading `.title` / `.body` off `undefined`.
  if (currentChapter === undefined) {
    return (
      <section
        aria-label="E-book reading area"
        className={[SURFACE_ROOT, 'items-center justify-center', className]
          .filter(Boolean)
          .join(' ')}
      >
        <p className="text-body text-text-muted">No chapter selected.</p>
      </section>
    );
  }

  return (
    <section
      aria-label="E-book reading area"
      className={[SURFACE_ROOT, className].filter(Boolean).join(' ')}
    >
      {/* Pinned header band — the progress bar + gradient divider stay fixed at
          the top while the body scrolls beneath them. */}
      <div className="flex-none">
        {/* Reading-progress bar: a thin full-width track with a purple gradient
            fill whose width is the runtime `progressPercent` (≈29% at initial
            load). `role="progressbar"` + the aria-value* attributes expose the
            progress to assistive tech (invisible a11y). The width percentage is a
            permitted runtime value; the fill COLOR comes from the
            `--gradient-accent` token. */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
          className="h-[var(--size-reading-progress-h)] w-full bg-[var(--border-white-07)]"
        >
          <div
            className="h-full bg-gradient-accent"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Gradient divider — a decorative full-width hairline using the
            `--gradient-accent` token, separating the header band from the
            reading content. `aria-hidden` (purely decorative). */}
        <div aria-hidden="true" className="h-u1 w-full bg-gradient-accent" />
      </div>

      {/* Scrollable reading body. `min-h-0` lets this flex child shrink so its
          own `overflow-y-auto` engages instead of pushing the page. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Centered, readable-measure prose column. `max-w-[var(--size-reading-measure)]`
            (the 680px `--size-reading-measure` token) caps the measure (~74ch at
            15px) and `mx-auto` centers it within the surface, giving the generous
            side gutters of the design; `px-8` keeps edge padding when the surface
            narrows toward 1280, and `py-12` provides vertical breathing room. */}
        <article className="mx-auto w-full max-w-[var(--size-reading-measure)] px-u32 py-u48">
          {/* Chapter title — the reading section heading. `text-detail-title`
              (Inter 600, 15px/22px) over the body's 400 weight gives clear
              hierarchy; `<h2>` sits beneath the app/book-level `<h1>` owned by
              the shell. */}
          <h2 className="mb-u24 text-detail-title text-text-primary">
            {currentChapter.title}
          </h2>

          {/* Justified prose body. Base typography = the `text-reader-body`
              token (Inter 400, 15px/26px); the inline `calc()` scales font-size
              AND line-height by the runtime `fontScale` (A-/A+), keeping the base
              in the token layer and only the multiplier here. `text-justify`
              matches the design's justified column; `READER_PROSE` styles the
              `<p>` / `<mark>` descendants. The body is rendered as REAL React
              elements from the structured `currentChapter.body` — NO raw-HTML
              injection (see file header). The paragraph/run lists are static mock
              data that never reorder, so the array index is a stable key. */}
          <div
            className={`text-reader-body text-justify text-text-primary ${READER_PROSE}`}
            style={{
              fontSize: `calc(var(--text-reader-body) * ${fontScale})`,
              lineHeight: `calc(var(--text-reader-body--line-height) * ${fontScale})`,
            }}
          >
            {currentChapter.body.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>
                {paragraph.runs.map((run, runIndex) =>
                  run.highlight ? (
                    <mark key={runIndex}>{run.text}</mark>
                  ) : (
                    <Fragment key={runIndex}>{run.text}</Fragment>
                  ),
                )}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
