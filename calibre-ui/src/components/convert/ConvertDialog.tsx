'use client';

/**
 * ==========================================================================
 * Calibre-UI — ConvertDialog
 * Convert Books MODAL root / composer (App 05, Figma node `6:9`).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ConvertDialog` is the ROOT/COMPOSER of the "Convert Books" modal overlay in
 * the UI-only Calibre e-book-manager prototype (Next.js 15 App Router · React 19
 * · TypeScript 5 strict · Tailwind CSS v4 CSS-first `@theme` tokens). It draws
 * NO modal chrome of its own — it assembles the four sibling convert components
 * INTO the shared `ModalShell` primitive and wires them to the global modal +
 * library Context state. It is mounted once by `AppShell` (the shared modal
 * mount point) and overlays the dimmed library.
 *
 * MODAL OVERLAY — NOT A ROUTE (the defining correctness property)
 * --------------------------------------------------------------------------
 * This dialog is a route-INDEPENDENT overlay (AAP §0.1.1 / §0.6.2). It is
 * visible iff `ModalProvider` reports the convert modal open (`openModal ===
 * 'convert'`) and it NEVER navigates: it imports no Next.js navigation module,
 * constructs no router, and reads no pathname hook here. Opening, stepping
 * (prev/next), and closing the dialog all leave the underlying App Router route
 * (`/` or `/grid`) completely unchanged.
 *
 * UI-ONLY · EVERYTHING IS SIMULATED
 * --------------------------------------------------------------------------
 * No real conversion EVER runs. There is no backend, no API, no file I/O, and no
 * EPUB parsing. "Convert Book" is simulated — clicking it simply `close()`s the
 * dialog (no timers, no work). The conversion log shows static mock terminal
 * output. This simulated-only behavior is the single most important behavioral
 * guarantee for App 05.
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * --------------------------------------------------------------------------
 * The dialog's interaction shape mirrors, for visual/structural parity only,
 * Calibre's desktop convert dialog: `src/calibre/gui2/convert/single.py` (the
 * `Config` QDialog that orchestrates the input/output format combos, a category
 * list of option panels, and an OK="Convert"/Cancel button box) and
 * `src/calibre/gui2/convert/gui_conversion.py` (`gui_convert`, the real
 * conversion entry point this prototype deliberately does NOT invoke). NO
 * Python/Qt code is imported, translated, or executed — the Calibre tree is a
 * read-only reference only.
 *
 * COMPOSITION (delegation map — top → bottom)
 * --------------------------------------------------------------------------
 *   ModalShell (variant="convert")    → ALL chrome: scrim, 880×740 card, border,
 *                                       shadow, radius, header title + ✕ close,
 *                                       scrollable body, footer hairline, ESC +
 *                                       backdrop close, focus trap, a11y. We pass
 *                                       ONLY open/title/onClose/variant/footer/children.
 *   §6.1 inner header   (authored here) → source-book identity (Figma `6:13`
 *                                       subtitle) + input→output recap + prev/next.
 *   §6.2 FormatSelectRow               → input → output format dropdowns (output
 *                                       accent-gradient highlighted).
 *   §6.3 ConvertOptionTabs             → the six option-category tabs.
 *   §6.4 LookAndFeelPanel | ConvertOptionPanel → the active option panel body
 *                                       ("Look & Feel" → LookAndFeelPanel; the
 *                                       other five tabs → a fully-built
 *                                       ConvertOptionPanel; never a placeholder).
 *   §6.5 ConversionLog                 → terminal-style mock conversion log.
 *   §6.6 footer (authored here)        → Cancel · Convert Book (both `close()`).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / typography / radius value resolves to an `@theme` token via a
 * Tailwind v4 utility (`text-text-primary`, `text-text-secondary`,
 * `text-text-muted`, `text-detail-title`, `text-body`, `bg-surface-1`,
 * `rounded-card`). There are NO raw hex / rgba literals — the card/scrim/shadow/
 * radius come entirely from `ModalShell`, and the gradient CTA comes from
 * `Button variant="primary"`. The only bare literals are layout utilities on
 * Tailwind's standard spacing scale (the house convention used by `ModalShell`/
 * `Button`) and the allowed neutral keywords.
 *
 * BLITZY [TEXT]: the exact chrome heading was to be confirmed via
 * `analyze_figma_node(6:9)`, which was unavailable at authoring time. "Convert
 * Books" is used for the dialog heading (App 05 is named "Convert Books"
 * throughout AAP §0.3.1 / §0.10.2 and in `FormatSelectRow`'s reconciled spec),
 * and "Convert Book" for the action CTA (AAP §0.3.1 / §0.7.4 "Cancel · Convert
 * Book"). Verified against the rendered design in visual validation.
 *
 * @see src/components/primitives/ModalShell — the dialog scaffold this composes into.
 * @see src/state/ModalProvider — `useModal` open-state (drives visibility + prev/next).
 * @see src/state/LibraryProvider — `useLibrary` books dataset (target-book resolution).
 * @see Agent Action Plan §0.3.1 (Workflow 4) / §0.7.4 — the App 05 specification.
 * @see src/calibre/gui2/convert/single.py — Calibre convert dialog (reference only).
 */

import { useEffect, useState, type JSX } from 'react';

import { ModalShell } from '@/components/primitives/ModalShell';
import { Button } from '@/components/primitives/Button';
import { useModal } from '@/state/ModalProvider';
import { useLibrary } from '@/state/LibraryProvider';
import type { Book } from '@/types';
import { FormatSelectRow } from '@/components/convert/FormatSelectRow';
import { ConvertOptionTabs } from '@/components/convert/ConvertOptionTabs';
import { LookAndFeelPanel } from '@/components/convert/LookAndFeelPanel';
import { ConvertOptionPanel } from '@/components/convert/ConvertOptionPanels';
import { ConversionLog } from '@/components/convert/ConversionLog';

/**
 * The option tab shown by default when the dialog opens. "Look & Feel" renders
 * the {@link LookAndFeelPanel}; every OTHER tab renders its own fully-built
 * panel via {@link ConvertOptionPanel} — no tab is ever a placeholder.
 */
const DEFAULT_OPTION_TAB = 'Look & Feel';

/**
 * Unicode navigation glyphs (TEXT in the global Inter face — never image/SVG
 * assets, per AAP §0.3.4). `←` / `→` label the prev/next step controls; `→`
 * doubles as the input→output recap connector in the inner header.
 */
const PREV_GLYPH = '\u2190'; // ← LEFTWARDS ARROW
const NEXT_GLYPH = '\u2192'; // → RIGHTWARDS ARROW
const ARROW_GLYPH = '\u2192'; // → input→output recap connector

/**
 * Pick a sensible default OUTPUT format that differs from the INPUT format, so
 * the dialog opens on a meaningful conversion target. EPUB → MOBI is the
 * canonical Calibre default; any other input defaults to EPUB.
 *
 * @param input - the resolved book's current format (e.g. `"EPUB"`).
 * @returns the default output format to seed the output dropdown with.
 */
function defaultOutputFor(input: string): string {
  return input.toUpperCase() === 'EPUB' ? 'MOBI' : 'EPUB';
}

/**
 * ConvertDialog — the App 05 "Convert Books" modal composer.
 *
 * Subscribes to `useModal` for open-state + the target book id and to
 * `useLibrary` for the books dataset; resolves the target `Book`; owns the local
 * input/output format + active-tab selection; and renders the dialog body +
 * footer inside `ModalShell`. Renders nothing extra when closed — `ModalShell`
 * itself returns `null` while `open` is `false`.
 *
 * @returns The Convert Books modal (a `ModalShell` element; an empty overlay
 *   that mounts nothing while the convert modal is closed).
 */
export function ConvertDialog(): JSX.Element {
  const { openModal, targetBookId, openConvert, close } = useModal();
  const { books, currentBook } = useLibrary();

  // Resolve the target book: the modal's target id → the library's current book
  // → the first book as a fallback. The shipped dataset is a fixed, non-empty
  // 15-book array (AAP §0.1.2), so in practice this always resolves; but the
  // provider could surface an empty / unavailable dataset, so `book` is typed as
  // possibly-`undefined` and the empty case is handled explicitly below — there
  // is no unguarded `books[0]` access and no modulo-by-zero.
  const book: Book | undefined =
    books.find((b) => b.id === targetBookId) ?? currentBook ?? books[0];

  // Local, dialog-owned selection state (UI-only; reseeded per target book in
  // the effect below). Hooks run UNCONDITIONALLY (Rules of Hooks) — they are all
  // declared before any conditional return. `inputFormat` mirrors the resolved
  // book's format; the initial output is a sensible differing target. When the
  // dataset is empty the seeds fall back to `''` and are never surfaced (the
  // dialog renders an empty-state body in that case).
  const [inputFormat, setInputFormat] = useState<string>(book?.format ?? '');
  const [outputFormat, setOutputFormat] = useState<string>(
    book ? defaultOutputFor(book.format) : '',
  );
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_OPTION_TAB);

  // Reseed the input format (and a sensible output target) whenever the dialog
  // re-targets a different book — e.g. via the prev/next steppers, which call
  // `openConvert(otherId)`. `book` keeps a STABLE reference across renders for a
  // given target (it is an element of the stable `books` array), so this effect
  // runs only when the target actually changes, never on every render. Guarded
  // for the empty-dataset case (no book → nothing to reseed).
  useEffect(() => {
    if (!book) return;
    setInputFormat(book.format);
    setOutputFormat(defaultOutputFor(book.format));
  }, [book]);

  // Step to the adjacent book and RE-TARGET the open dialog in place — no close,
  // no navigation — by re-opening convert at the neighbour's id (the provider
  // exposes no `setTargetBookId`; `openConvert(id)` is the re-target path). The
  // index wraps around both ends so both steppers are enabled whenever there are
  // 2+ books. Stepping requires a count > 1; with 0 or 1 books the steppers are
  // disabled and `stepTo` is a guarded no-op (it never indexes an invalid slot
  // and never computes a modulo-by-zero / `NaN` index).
  const canStep = books.length > 1;
  const currentIndex = book ? books.findIndex((b) => b.id === book.id) : -1;
  const stepTo = (delta: number): void => {
    if (!canStep || currentIndex < 0) return;
    const count = books.length;
    const nextIndex = (currentIndex + delta + count) % count;
    openConvert(books[nextIndex].id);
  };

  const isConvertOpen = openModal === 'convert';

  // Empty-data edge (CP3 edge-handling requirement): no resolvable target book —
  // the provider dataset is empty or unavailable. Render the shell with a
  // token-compliant empty state instead of indexing `books[0]`. Every hook above
  // has already run, so this conditional return does not violate the Rules of
  // Hooks. The shell still self-gates on `isConvertOpen`, so nothing mounts while
  // the convert modal is closed.
  if (!book) {
    return (
      <ModalShell
        open={isConvertOpen}
        title="Convert Books"
        variant="convert"
        onClose={close}
        footer={<Button variant="secondary" label="Close" onClick={close} />}
      >
        <div className="flex flex-col items-center justify-center gap-u8 px-u20 py-u48 text-center">
          <p className="text-detail-title text-text-primary">
            No book to convert
          </p>
          <p className="text-body text-text-muted">
            Select a book from the library to configure a conversion.
          </p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      open={isConvertOpen}
      title="Convert Books"
      variant="convert"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" label="Cancel" onClick={close} />
          <Button variant="primary" label="Convert Book" onClick={close} />
        </>
      }
    >
      {/* Body: a vertical stack inset to match the chrome header's px-5. The
          ModalShell body owns the scroll, so tall content (the option panel +
          the log) scrolls within the 740px card with zero horizontal overflow. */}
      <div className="flex flex-col gap-u20 px-u20 py-u20">
        {/* §6.1 — inner header: the source-book identity (Figma 6:13 subtitle)
            and an input→output recap, with prev/next steppers on the right. The
            ✕ close lives in ModalShell's chrome header and is NOT duplicated. */}
        <section className="flex items-start justify-between gap-u16">
          <div className="flex min-w-0 flex-col gap-u4">
            <h3 className="truncate text-detail-title text-text-primary">
              {book.title}
            </h3>
            <p className="truncate text-body text-text-secondary">
              {`by ${book.author}`}
              <span className="text-text-muted">
                {` · ${inputFormat} `}
                <span aria-hidden="true">{ARROW_GLYPH}</span>
                {` ${outputFormat}`}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-u8">
            <Button
              variant="secondary"
              label={PREV_GLYPH}
              aria-label="Previous book"
              disabled={!canStep}
              onClick={() => stepTo(-1)}
            />
            <Button
              variant="secondary"
              label={NEXT_GLYPH}
              aria-label="Next book"
              disabled={!canStep}
              onClick={() => stepTo(1)}
            />
          </div>
        </section>

        {/* §6.2 — input → output format row (the output dropdown shows the
            accent-gradient highlight via `outputActive`). */}
        <FormatSelectRow
          inputFormat={inputFormat}
          outputFormat={outputFormat}
          onInputChange={setInputFormat}
          onOutputChange={setOutputFormat}
          outputActive
        />

        {/* §6.3 + §6.4 — the option-category tab strip and its active panel,
            grouped so the panel sits flush beneath its tabs. EVERY tab renders a
            fully-built panel: "Look & Feel" → LookAndFeelPanel; each of the other
            five tabs → its concrete ConvertOptionPanel (never a placeholder). */}
        <div className="flex flex-col gap-u16">
          <ConvertOptionTabs active={activeTab} onSelect={setActiveTab} />
          {activeTab === DEFAULT_OPTION_TAB ? (
            <LookAndFeelPanel />
          ) : (
            <ConvertOptionPanel activeTab={activeTab} />
          )}
        </div>

        {/* §6.5 — terminal-style mock conversion log (static lines; no real
            conversion ever runs). */}
        <ConversionLog />
      </div>
    </ModalShell>
  );
}

export default ConvertDialog;
