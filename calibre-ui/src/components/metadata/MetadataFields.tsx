'use client';

/**
 * ==========================================================================
 * Calibre-UI — MetadataFields
 * The App 07 Metadata Editor modal RIGHT-column field grid.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `MetadataFields` renders the RIGHT column of the App 07 Metadata Editor modal
 * (Figma screen `9:9`, right-column frame `9:51`) of the UI-only Calibre
 * e-book-manager prototype (Next.js 15 App Router · React 19 · TypeScript 5
 * strict · Tailwind CSS v4 CSS-first tokens). It is the editable metadata field
 * grid that sits to the right of the cover/format column, laid out top-to-bottom
 * in the EXACT Figma order:
 *
 *   1. Title                                   (full width, `9:52`/`9:53`)
 *   2. Author(s)                               (full width, `9:55`/`9:56`)
 *   3. Title Sort  |  Author Sort              (two-up,  `9:59` | `9:62`)
 *   4. Series      |  Series index             (two-up,  `9:65` | `9:67`)
 *   5. Publisher   |  Publication Date         (two-up,  `9:70` | `9:73`)
 *   6. Language    |  Rating                   (two-up,  `9:76` | `9:79`)
 *      ── {children}: <TagChipEditor/> then <IdentifierRows/> ──  (injected here)
 *   7. Synopsis                                (full width, `9:117`/`9:118`)
 *
 * The Tags chip editor and the Identifiers key/value editor are NOT rendered by
 * this component — the parent `MetadataDialog` injects them as `children`
 * BETWEEN the Language/Rating row and the Synopsis textarea, preserving the
 * Figma vertical order (fields → Tags → Identifiers → Synopsis).
 *
 * It is a LEAF composition component built from TWO design-system primitives —
 * {@link InputField} (all nine single-line fields) and {@link Textarea} (the
 * Synopsis). The Textarea primitive was added in the CP4 Figma-fidelity fix to
 * close a design-system coverage gap — the Synopsis previously used a hand-rolled
 * token-styled `<textarea>` — so the modal now renders NO raw `<input>`,
 * `<textarea>`, `<select>`, `<button>`, or heading of its own (AAP §0.4.5).
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * Every field binds an `onChange` handler, so this must be a Client Component —
 * App Router components default to Server Components, which cannot attach change
 * handlers. The directive is the very first line, before any import. The
 * component is SSR-safe and holds NO local state: it is fully controlled, and
 * there is no `window` / `Math.random` / `Date.now` / `localStorage` access, so
 * it hydrates without warnings (the one hook, `useId`, is SSR-stable by design).
 *
 * FULLY CONTROLLED, NO LOCAL STATE (the state contract)
 * --------------------------------------------------------------------------
 * Every field value lives in the PARENT (`MetadataDialog`): this component never
 * copies a value into local state and never mutates one directly. Each edit is
 * reported upward through the matching `on*Change(nextValue)` callback. The
 * MOCK-ONLY fields — `titleSort`, `authorSort`, `seriesIndex`, `publisher`,
 * `language` — are NOT part of the `Book` type; they are local form fields the
 * parent seeds (e.g. `titleSort` defaulted from the title, `publisher` /
 * `language` to plausible mock values). `publicationDate` maps to `book.date`
 * and `synopsis` to `book.synopsis`. `rating` is the SHARED single source of
 * truth with the left cover column. UI-only: edits update React state only — no
 * persistence, no network, no real metadata download (AAP §0.1.2 · §0.9).
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node on the App 07 modal (`9:9`) and its
 * right-column frame (`9:51`, content width 580px). The vertical rhythm is the
 * CONFIRMED Figma grid: a 56px label-top→label-top pitch (a 12px label + a 4px
 * label→control gap + a 38px control), reproduced here as a `gap-1` (4px)
 * field-grid stack over the 36px `InputField` height (`h-9`); paired fields sit
 * in two-up rows with a 12px (`gap-3`) inter-column gap. Each field carries a
 * small uppercase label above its control.
 *
 * BLITZY [COMPONENT] (Language is a TEXT field, NOT a Select): the file contract
 * tentatively suggested a `Select` dropdown for Language. analyze_figma_node on
 * `9:76` CONFIRMED Language is drawn as a PLAIN TEXT INPUT — its frame holds only
 * the value text "English" (`9:77`) with NO chevron / caret node. Per the
 * contract's own "match what analyze_figma_node reports for 9:9" instruction,
 * the Figma-precedence rule, and DS2-d (never render an element — here a
 * dropdown chevron — that is absent from the design), Language is implemented as
 * an {@link InputField} `variant="text"`. The whole right column is therefore an
 * all-text-input grid (no dropdowns), so the listed `Select` dependency is
 * intentionally NOT imported (depends_on_files is an allow-list, not a mandate,
 * and an unused import would violate `@typescript-eslint/no-unused-vars`). The
 * select-style language affordance is deferred — acceptable for a UI-only mock
 * that mirrors the static design exactly.
 *
 * BLITZY [STATE] (Rating is a non-interactive read-back; Title shows always-on glow):
 *   • RATING — analyze_figma_node on `9:79` CONFIRMED a bare row of amber
 *     (`#F59E0B`) "★★★★★" glyphs (Inter 24px), NOT a boxed input and NOT a
 *     dropdown; it sits directly on the surface. The editable `StarRating`
 *     primitive is NOT a dependency of this file and editing lives in the left
 *     cover column (the contract: "keep rating in the cover column and render a
 *     small [read-back] here"), so the Rating here is a DISPLAY-ONLY reflection
 *     of the shared `rating` value. It is rendered with the classic two-layer
 *     star-overlay (a muted base track + an amber fill clipped to
 *     `(rating / 5) * 100%` via the `--rating-fill` custom property), which
 *     faithfully renders ANY 0–5 value — full, half, and zero (UI9 / DS5-g
 *     data-driven completeness) — entirely from `@theme` color tokens. `rating`
 *     is consumed for display; `onRatingChange` is part of the shared contract
 *     but is owned by the left column's editable control, so it is not wired
 *     here. Both star layers are `aria-hidden`; the wrapper is `role="img"` with
 *     an `aria-label` carrying the numeric rating, so screen readers hear the
 *     value rather than a run of glyphs.
 *   • TITLE — the Figma Title field (`9:53`) is drawn in its FOCUSED state with a
 *     purple glow: a translucent purple fill `rgba(123,97,255,0.1)` + a
 *     `rgba(123,97,255,0.5)` border + a soft accent halo, with a bright `#F1F5FF`
 *     value. AAP §0.3.1 / §0.7.4 / §0.10.2 EXPLICITLY specify "Title … with purple
 *     focus glow", so per D1 (an explicit AAP rule is authoritative) this is now
 *     rendered as an ALWAYS-VISIBLE glow via the {@link InputField} `active` prop —
 *     accent-tinted fill + accent border + the `--shadow-input-glow` halo,
 *     persistent rather than only on `:focus`. The Title is additionally rendered
 *     first with `autoFocus`, so it also holds keyboard focus on modal open. This
 *     supersedes the earlier focus-only reconciliation: the CP4 finding flagged the
 *     missing always-on glow, and the explicit AAP requirement outranks the prior
 *     "default state only at rest" reading for this one designated field.
 *
 * BLITZY [DESIGN] (field labels): analyze_figma_node reports the right-column
 * labels (`9:52`, `9:55`, …) as `#3A4060` (the text-placeholder token), Inter
 * SemiBold 600, 10px, authored uppercase. Per the CP4 Figma-fidelity finding and
 * D1 precedence (Figma is authoritative for UI), this component now reproduces
 * that EXACTLY — `text-text-placeholder` (`#3A4060`) + `text-field-label` (the
 * dedicated Inter 600 / 10px label token) + `uppercase` — replacing the earlier
 * readable `text-text-muted` (`#64748B`) / 400 reconciliation. The sibling
 * `TagChipEditor` "Tags" and `IdentifierRows` "Identifiers" section labels adopt
 * the SAME `#3A4060` / 600 treatment in this CP4 pass, so the whole modal column
 * stays visually consistent. See the `LABEL_CLASSES` BLITZY [A11Y] note for the
 * Figma-mandated contrast trade-off recorded for designer review. The `uppercase`
 * utility (text-transform only — no color/size token) honors Figma's authoritative
 * uppercase case while the accessible DOM text stays Title-Case.
 *
 * BLITZY [DATA] (Publication Date shows a display string): Figma `9:73` shows the
 * publication date already formatted ("Aug 1, 1965"), not a raw ISO string and
 * not a date picker. Because this is a CONTROLLED, freely-editable text field,
 * displaying a formatted string while storing ISO would fight the user on every
 * keystroke; instead the field renders the `publicationDate` string VERBATIM and
 * the parent (`MetadataDialog`) is responsible for seeding it in the desired
 * human-readable form (it can call `@/lib/format`'s `formatDate(book.date)` when
 * seeding). `formatDate` is therefore intentionally NOT imported here — this
 * component is a pure controlled view that never transforms the value it shows.
 *
 * BLITZY [TYPOGRAPHY] (rating star size): the Figma rating glyphs are 24px. The
 * bespoke type scale has no 24px role (the largest is `text-dialog-heading`,
 * 20px), so the read-back uses Tailwind's `text-2xl` utility, which resolves to
 * the `--text-2xl` (1.5rem = 24px) theme variable present in `:root` (the
 * `@theme static` block EXTENDS — never resets — Tailwind's default theme), so
 * the size still resolves to a theme token rather than a raw literal and matches
 * Figma exactly. `leading-none` tightens the line box to the glyph height.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / RADIUS / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`. The single-line fields' surface / border / radius /
 * height / placeholder / typography all live INSIDE the `InputField` primitive,
 * and the Synopsis surface lives INSIDE the `Textarea` primitive, so neither
 * declares any here. The token-backed utilities used DIRECTLY are the field labels
 * (`text-text-placeholder` + `text-field-label`) and the Rating read-back
 * (`text-text-muted` base track + `text-star` amber fill). There are NO raw hex /
 * rgba color literals. The only bare utilities are LAYOUT / appearance values that
 * carry no color information — Tailwind's spacing / flex scale (`flex`, `flex-col`,
 * `w-full`, `gap-3`, `gap-1`, `flex-1`, `min-w-0`, `w-30`, `shrink-0`,
 * `items-start`), the `uppercase` / `whitespace-nowrap` / `select-none`
 * text-appearance utilities, and the dynamic `w-[var(--rating-fill)]` width fed by
 * a computed percentage — all permitted.
 *
 * RESPONSIVE INTEGRITY (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * Each two-up row is a `flex … gap-3` whose columns are `flex-1 min-w-0` (the
 * Series row pairs a `flex-1 min-w-0` Series field with a fixed `w-30 shrink-0`
 * index). The `min-w-0` on every growing column is the critical guard — without
 * it a long unbroken value would establish a min-content floor and force
 * horizontal overflow; with it the fields shrink in proportion as the ~580px
 * metadata column narrows, so the layout holds cleanly from the 1440px baseline
 * to the 1280px floor.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • Every single-line field is a real `<input>` (via `InputField`) bound to a
 *   visible `<label htmlFor>` through a stable `useId`-derived id. The label-less
 *   Series index field (Figma gives it no label of its own — "Series" heads the
 *   row) instead carries an explicit `aria-label="Series index"`, with an
 *   invisible, `aria-hidden` label-height spacer keeping its control top-aligned
 *   with the Series field.
 * • Field labels are non-interactive `<label>`s and the Rating label is a
 *   `<span>` — never headings, so the document outline stays clean.
 * • The Synopsis is a real, controlled `<textarea>` (via the `Textarea`
 *   primitive) bound to its `<label>`.
 * • The Rating read-back is `role="img"` with a descriptive `aria-label`; its
 *   star glyphs are `aria-hidden`. Color is never the sole signal — the numeric
 *   rating is in the accessible name.
 *
 * @see src/components/primitives/InputField.tsx — the controlled input primitive.
 * @see src/components/primitives/Textarea.tsx — the controlled multi-line primitive (Synopsis).
 * @see src/components/metadata/TagChipEditor.tsx  — injected as `children` (Tags).
 * @see src/components/metadata/IdentifierRows.tsx — injected as `children` (IDs).
 * @see src/lib/format.ts — `formatRating` (rating accessible-name helper).
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 (App 07) / §0.4.2 — component & token mapping.
 * @see src/calibre/gui2/metadata/single.py — Calibre metadata editor (reference only).
 * @see src/calibre/gui2/metadata/basic_widgets.py — Calibre field widgets (reference only).
 */

import type { CSSProperties, JSX, ReactNode } from 'react';
import { useId } from 'react';

import { InputField } from '@/components/primitives/InputField';
import { Textarea } from '@/components/primitives/Textarea';
import { formatRating } from '@/lib/format';

/**
 * Props for {@link MetadataFields}.
 *
 * A fully CONTROLLED component: the parent `MetadataDialog` owns every value and
 * receives every edit through the matching `on*Change` callback. The mock-only
 * fields (`titleSort`, `authorSort`, `seriesIndex`, `publisher`, `language`) are
 * NOT part of the `Book` type — they are local form fields the parent seeds.
 */
export interface MetadataFieldsProps {
  /** Book title (full-width Title field, `9:53`). Rendered focused on open. */
  title: string;
  /** Called with the next title string on each edit. */
  onTitleChange: (value: string) => void;

  /** Author(s) display string, e.g. "Herbert, Frank" (full-width, `9:56`). */
  author: string;
  /** Called with the next author string on each edit. */
  onAuthorChange: (value: string) => void;

  /** Title sort key (mock-only; parent typically seeds from `title`), `9:59`. */
  titleSort: string;
  /** Called with the next title-sort string on each edit. */
  onTitleSortChange: (value: string) => void;

  /** Author sort key (mock-only), `9:62`. */
  authorSort: string;
  /** Called with the next author-sort string on each edit. */
  onAuthorSortChange: (value: string) => void;

  /** Series name, e.g. "Dune Chronicles" (`9:65`); empty when standalone. */
  series: string;
  /** Called with the next series string on each edit. */
  onSeriesChange: (value: string) => void;

  /**
   * Series index, e.g. "1" (mock-only; numeric `variant="number"` field, but
   * string-backed for controlled-input simplicity), `9:67`.
   */
  seriesIndex: string;
  /** Called with the next series-index string on each edit. */
  onSeriesIndexChange: (value: string) => void;

  /** Publisher name (mock-only), e.g. "Chilton Books" (`9:70`). */
  publisher: string;
  /** Called with the next publisher string on each edit. */
  onPublisherChange: (value: string) => void;

  /**
   * Publication date as the DISPLAY string to show verbatim (`9:73`), seeded by
   * the parent from `book.date` (e.g. formatted "Aug 1, 1965"). See the file
   * header BLITZY [DATA] note — this component never reformats it.
   */
  publicationDate: string;
  /** Called with the next publication-date string on each edit. */
  onPublicationDateChange: (value: string) => void;

  /** Language (mock-only), e.g. "English" (`9:76`, a plain text field). */
  language: string;
  /** Called with the next language string on each edit. */
  onLanguageChange: (value: string) => void;

  /**
   * Rating 0–5 (in 0.5 steps) — the SHARED single source of truth with the left
   * cover column. Displayed here as a non-interactive amber star read-back
   * (`9:79`); editing happens in the cover column.
   */
  rating: number;
  /**
   * Called with the next rating when changed. Part of the shared contract; the
   * editable control is the left cover column's `StarRating`, so this read-back
   * does not invoke it (see the file header BLITZY [STATE] note).
   */
  onRatingChange: (value: number) => void;

  /** Synopsis / description (full-width textarea, `9:118`), seeded from `book.synopsis`. */
  synopsis: string;
  /** Called with the next synopsis string on each edit. */
  onSynopsisChange: (value: string) => void;

  /**
   * The Tags chip editor (`<TagChipEditor/>`) followed by the Identifiers editor
   * (`<IdentifierRows/>`), injected by `MetadataDialog` BETWEEN the
   * Language/Rating row and the Synopsis textarea to preserve the Figma order
   * (fields → Tags → Identifiers → Synopsis). Rendered as direct flex-column
   * children so they flow in the same column rhythm.
   */
  children?: ReactNode;
}

/* ==========================================================================
 * Token-backed class constants (zero hardcoded color/radius/typography values;
 * only layout / appearance utilities appear as bare literals).
 * ======================================================================== */

/**
 * Root column: a full-width vertical stack with a 12px (`gap-3`) gap between the
 * three major regions — the field grid, the injected `children` (Tags then
 * Identifiers), and the Synopsis. This reproduces the CONFIRMED Figma gaps in
 * the lower column (Identifiers→Synopsis = 12px exactly; Tags→Identifiers ≈
 * 12–14px) while the tighter field-row rhythm is handled by the nested grid.
 */
const ROOT_CLASSES = 'flex w-full flex-col gap-u12';

/**
 * Field grid: the six labeled field rows (two full-width + four two-up) stacked
 * with a 4px (`gap-1`) gap. Combined with the 12px label + 4px label→control gap
 * + 36px (`h-9`) control of each group, this yields the CONFIRMED ~56px Figma
 * label-top→label-top pitch (`9:52`→`9:55`→… all Δ56).
 */
const FIELD_GRID_CLASSES = 'flex w-full flex-col gap-u4';

/**
 * A single field group: the label stacked 4px (`gap-1`) above its control,
 * spanning the full available width. Used for the full-width Title / Author(s) /
 * Synopsis groups and as each column of a two-up row.
 */
const FIELD_GROUP_CLASSES = 'flex w-full flex-col gap-u4';

/**
 * A two-up row: two field columns side by side with a 12px (`gap-3`) inter-column
 * gap (the CONFIRMED Figma gap between paired controls). `items-start` top-aligns
 * the columns so an uneven control (e.g. the label-less index, or the shorter
 * rating glyphs) still aligns to the row's top edge.
 */
const TWO_UP_ROW_CLASSES = 'flex w-full items-start gap-u12';

/**
 * An equal-width two-up column: grows to share the row width with its sibling and
 * `min-w-0` lets it shrink below its content's intrinsic width (the critical
 * 1440→1280 overflow guard). Used for Title Sort | Author Sort, the wide Series
 * field, Publisher | Publication Date, and Language | Rating.
 */
const COLUMN_CLASSES = 'flex min-w-0 flex-1 flex-col gap-u4';

/**
 * The narrow Series-index column: a fixed `w-30` (120px — the CONFIRMED Figma
 * index width `9:67`) that `shrink-0` holds while the wide Series field
 * (`flex-1`) absorbs all width changes, reproducing the ~440:120 Series:index
 * proportion.
 */
const INDEX_COLUMN_CLASSES = 'flex w-u120 shrink-0 flex-col gap-u4';

/**
 * The field label — the EXACT App 07 Figma label treatment (`9:52`, `9:55`, …):
 * `text-text-placeholder` (`#3A4060`) + `text-field-label` (Inter SemiBold 600 /
 * 10px) + `uppercase`. Per the CP4 Figma-fidelity finding (MetadataFields L354)
 * and D1 precedence (Figma is authoritative for UI), the labels now match the
 * design's authored `#3A4060` / 600-weight exactly, replacing the earlier
 * readable `text-text-muted` / 400 reconciliation. Applied to `<label>` (fields)
 * and `<span>` (the Rating label); the sibling `TagChipEditor` / `IdentifierRows`
 * section labels adopt the SAME treatment so the whole modal column is consistent.
 *
 * BLITZY [A11Y]: `#3A4060` on the `#13162E` modal surface computes ≈1.55:1 —
 * below WCAG AA for text. Per D1 the explicit Figma value is authoritative and is
 * reproduced EXACTLY (never silently lightened); this flag records the gap for
 * designer review. The labels are non-essential captions — every field also has a
 * visible value and an accessible name — so meaning never rests on the label alone.
 */
const LABEL_CLASSES = 'text-text-placeholder text-field-label uppercase select-none';

/**
 * Caller-`className` for each `InputField`: `w-full` makes the primitive's
 * wrapper fill its field group / column (the primitive owns all visuals; the
 * caller owns width — see InputField's header).
 */
const FIELD_WIDTH_CLASSES = 'w-full';

/**
 * The Rating read-back container — a `w-fit` (hug-content) `relative` flex box at
 * the Figma 24px glyph size (`text-2xl`, see BLITZY [TYPOGRAPHY]); `leading-none`
 * tightens the line box, `select-none` keeps the decorative glyphs unselectable.
 * `relative` anchors the absolutely-positioned amber fill overlay.
 */
const RATING_STARS_CLASSES =
  'relative flex w-fit select-none leading-none text-2xl';

/**
 * The Rating base (empty) track: five muted `text-text-muted` stars that define
 * the container width and show through wherever the amber fill stops.
 */
const RATING_BASE_CLASSES = 'text-text-muted';

/**
 * The Rating amber fill overlay: five `text-star` (`#F59E0B`) stars stacked over
 * the base, pinned to the top inline-start and clipped (`overflow-hidden`,
 * `whitespace-nowrap`) to `w-[var(--rating-fill)]` — the `(rating / 5) * 100%`
 * width set on the container — so the visible amber portion encodes the value.
 */
const RATING_FILL_CLASSES =
  'absolute top-0 start-0 overflow-hidden whitespace-nowrap text-star ' +
  'w-[var(--rating-fill)]';

/**
 * Visible row count for the Synopsis {@link Textarea} — 4 rows at the primitive's
 * `leading-relaxed` line height plus its `py-2` padding renders ≈96px, closely
 * matching the CONFIRMED Figma synopsis box height (90px, `9:118`). The surface
 * (fill / border / radius / typography / focus) is owned by the Textarea
 * primitive; this component supplies only the row count.
 */
const SYNOPSIS_ROWS = 4;

/**
 * The five filled-star glyphs ("★★★★★", U+2605 ×5) used by BOTH rating layers.
 * Unicode text in the Inter font — never an image/SVG asset (AAP §0.3.4).
 */
const RATING_GLYPHS = '\u2605\u2605\u2605\u2605\u2605';

/* ---- Field placeholders (shown only when a field is empty; the Figma default
 * state is populated, so these never appear at rest — they are an empty-state
 * affordance consistent with the sibling editors). ----------------------- */
const TITLE_PLACEHOLDER = 'Book title';
const AUTHOR_PLACEHOLDER = 'Author name(s)';
const TITLE_SORT_PLACEHOLDER = 'Sort-as title';
const AUTHOR_SORT_PLACEHOLDER = 'Sort-as author';
const SERIES_PLACEHOLDER = 'Series name';
const SERIES_INDEX_PLACEHOLDER = 'No.';
const PUBLISHER_PLACEHOLDER = 'Publisher';
const PUBLICATION_DATE_PLACEHOLDER = 'Publication date';
const LANGUAGE_PLACEHOLDER = 'Language';
const SYNOPSIS_PLACEHOLDER = 'Synopsis / description';

/**
 * MetadataFields — the App 07 Metadata Editor modal right-column field grid.
 *
 * Renders, top-to-bottom in the exact Figma order, the controlled metadata
 * fields: Title (auto-focused), Author(s), the Title Sort | Author Sort,
 * Series | Series index, Publisher | Publication Date, and Language | Rating
 * two-up rows, then the injected `children` (Tags then Identifiers), then the
 * Synopsis textarea. Fully controlled and hook-light: the only hook is `useId`
 * for stable label↔control associations; all values and edits are owned by the
 * parent `MetadataDialog`.
 *
 * @param props - {@link MetadataFieldsProps}
 * @returns The rendered metadata field grid.
 */
export function MetadataFields({
  title,
  onTitleChange,
  author,
  onAuthorChange,
  titleSort,
  onTitleSortChange,
  authorSort,
  onAuthorSortChange,
  series,
  onSeriesChange,
  seriesIndex,
  onSeriesIndexChange,
  publisher,
  onPublisherChange,
  publicationDate,
  onPublicationDateChange,
  language,
  onLanguageChange,
  rating,
  synopsis,
  onSynopsisChange,
  children,
}: MetadataFieldsProps): JSX.Element {
  // One SSR-stable base id (React `useId`) yields a unique, deterministic id per
  // field for `<label htmlFor>` ↔ control association — no per-field hook calls,
  // no hydration mismatch. The label-less Series-index field needs none (it uses
  // an `aria-label` instead), and the Rating read-back is not a form control.
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const authorId = `${baseId}-author`;
  const titleSortId = `${baseId}-title-sort`;
  const authorSortId = `${baseId}-author-sort`;
  const seriesId = `${baseId}-series`;
  const publisherId = `${baseId}-publisher`;
  const publicationDateId = `${baseId}-publication-date`;
  const languageId = `${baseId}-language`;
  const synopsisId = `${baseId}-synopsis`;

  // Rating read-back (display only). Clamp to [0, 5] (coercing non-finite to 0)
  // and express the amber-fill width as a percentage on the `--rating-fill`
  // custom property the overlay consumes — so any 0–5 value (full / half / zero)
  // renders faithfully (UI9 / DS5-g data-driven completeness). The editable
  // control is the left cover column (see file header BLITZY [STATE]).
  const clampedRating = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const ratingStyle = {
    '--rating-fill': `${(clampedRating / 5) * 100}%`,
  } as CSSProperties;
  const ratingLabel = `Rating: ${formatRating(clampedRating)} out of 5`;

  return (
    <div className={ROOT_CLASSES}>
      {/* FIELD GRID — Title → Author(s) → four two-up rows. The 4px (`gap-1`)
          stack over the 36px control yields the CONFIRMED ~56px Figma pitch. */}
      <div className={FIELD_GRID_CLASSES}>
        {/* 1 · TITLE (full width, `9:53`). Drawn in the Figma "focused" state with
            an ALWAYS-VISIBLE purple glow via InputField's `active` prop (persistent
            accent-tinted fill + accent border + the `--shadow-input-glow` halo) —
            AAP §0.3.1 / §0.7.4 / §0.10.2 "Title … with purple focus glow"; see
            BLITZY [STATE]. `autoFocus` additionally hands it focus on modal open. */}
        <div className={FIELD_GROUP_CLASSES}>
          <label htmlFor={titleId} className={LABEL_CLASSES}>
            Title
          </label>
          <InputField
            id={titleId}
            variant="text"
            value={title}
            onChange={onTitleChange}
            placeholder={TITLE_PLACEHOLDER}
            active
            autoFocus
            className={FIELD_WIDTH_CLASSES}
          />
        </div>

        {/* 2 · AUTHOR(S) (full width, `9:56`). */}
        <div className={FIELD_GROUP_CLASSES}>
          <label htmlFor={authorId} className={LABEL_CLASSES}>
            Author(s)
          </label>
          <InputField
            id={authorId}
            variant="text"
            value={author}
            onChange={onAuthorChange}
            placeholder={AUTHOR_PLACEHOLDER}
            className={FIELD_WIDTH_CLASSES}
          />
        </div>

        {/* 3 · TITLE SORT | AUTHOR SORT (two-up, equal columns; `9:59` | `9:62`). */}
        <div className={TWO_UP_ROW_CLASSES}>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={titleSortId} className={LABEL_CLASSES}>
              Title Sort
            </label>
            <InputField
              id={titleSortId}
              variant="text"
              value={titleSort}
              onChange={onTitleSortChange}
              placeholder={TITLE_SORT_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={authorSortId} className={LABEL_CLASSES}>
              Author Sort
            </label>
            <InputField
              id={authorSortId}
              variant="text"
              value={authorSort}
              onChange={onAuthorSortChange}
              placeholder={AUTHOR_SORT_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
        </div>

        {/* 4 · SERIES (wide) | SERIES INDEX (narrow, no own label; `9:65` | `9:67`).
            The index reproduces the ~440:120 proportion via a fixed `w-30`
            column; an invisible label-height spacer keeps its control aligned
            with the Series control, and an `aria-label` names the field. */}
        <div className={TWO_UP_ROW_CLASSES}>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={seriesId} className={LABEL_CLASSES}>
              Series
            </label>
            <InputField
              id={seriesId}
              variant="text"
              value={series}
              onChange={onSeriesChange}
              placeholder={SERIES_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
          <div className={INDEX_COLUMN_CLASSES}>
            {/* Invisible, aria-hidden label-height spacer: reserves the label row
                so the index control top-aligns with the Series control. */}
            <span aria-hidden className={`${LABEL_CLASSES} invisible`}>
              Index
            </span>
            <InputField
              variant="number"
              value={seriesIndex}
              onChange={onSeriesIndexChange}
              placeholder={SERIES_INDEX_PLACEHOLDER}
              aria-label="Series index"
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
        </div>

        {/* 5 · PUBLISHER | PUBLICATION DATE (two-up; `9:70` | `9:73`). The date is
            shown verbatim as the parent-supplied display string (BLITZY [DATA]). */}
        <div className={TWO_UP_ROW_CLASSES}>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={publisherId} className={LABEL_CLASSES}>
              Publisher
            </label>
            <InputField
              id={publisherId}
              variant="text"
              value={publisher}
              onChange={onPublisherChange}
              placeholder={PUBLISHER_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={publicationDateId} className={LABEL_CLASSES}>
              Publication Date
            </label>
            <InputField
              id={publicationDateId}
              variant="text"
              value={publicationDate}
              onChange={onPublicationDateChange}
              placeholder={PUBLICATION_DATE_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
        </div>

        {/* 6 · LANGUAGE | RATING (two-up; `9:76` | `9:79`). Language is a plain
            text field (Figma shows no chevron — BLITZY [COMPONENT]); Rating is a
            non-interactive amber star read-back of the shared value. */}
        <div className={TWO_UP_ROW_CLASSES}>
          <div className={COLUMN_CLASSES}>
            <label htmlFor={languageId} className={LABEL_CLASSES}>
              Language
            </label>
            <InputField
              id={languageId}
              variant="text"
              value={language}
              onChange={onLanguageChange}
              placeholder={LANGUAGE_PLACEHOLDER}
              className={FIELD_WIDTH_CLASSES}
            />
          </div>
          <div className={COLUMN_CLASSES}>
            {/* Rating label is a `<span>` — there is no associated form control
                (the read-back is not focusable), so a `<label>` would be invalid. */}
            <span className={LABEL_CLASSES}>Rating</span>
            <div role="img" aria-label={ratingLabel} className={RATING_STARS_CLASSES} style={ratingStyle}>
              {/* Muted base track defines the width; amber overlay clipped to the
                  rating percentage shows through it. Both layers are decorative. */}
              <span aria-hidden className={RATING_BASE_CLASSES}>
                {RATING_GLYPHS}
              </span>
              <span aria-hidden className={RATING_FILL_CLASSES}>
                {RATING_GLYPHS}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INJECTED CHILDREN — `<TagChipEditor/>` then `<IdentifierRows/>` from
          `MetadataDialog`, placed BETWEEN the Language/Rating row and Synopsis to
          preserve the Figma order. They render as direct flex-column children, so
          the root `gap-3` rhythm spaces them from the field grid and the Synopsis. */}
      {children}

      {/* 7 · SYNOPSIS (full width, `9:118`). The `Textarea` design-system
          primitive — the multi-line sibling of `InputField`, added in this CP4 fix
          to close the coverage gap the finding flagged (Rules R4) so the modal
          renders NO hand-rolled raw `<textarea>`. It owns the canonical field
          surface; this caller supplies only the controlled value, value-first
          `onChange`, placeholder, and the Figma row count. */}
      <div className={FIELD_GROUP_CLASSES}>
        <label htmlFor={synopsisId} className={LABEL_CLASSES}>
          Synopsis
        </label>
        <Textarea
          id={synopsisId}
          value={synopsis}
          onChange={onSynopsisChange}
          placeholder={SYNOPSIS_PLACEHOLDER}
          rows={SYNOPSIS_ROWS}
        />
      </div>
    </div>
  );
}

export default MetadataFields;

