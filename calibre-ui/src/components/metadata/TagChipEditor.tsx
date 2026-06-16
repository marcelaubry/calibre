'use client';

/**
 * ==========================================================================
 * Calibre-UI — TagChipEditor
 * The App 07 Metadata Editor "Tags" chip editor (right-column field).
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `TagChipEditor` is the composition component for the "Tags" field in the
 * right column of the App 07 Metadata Editor modal (Figma screen `9:9`,
 * sub-nodes `9:80` label + `9:81` chips container) of the UI-only Calibre
 * e-book-manager prototype (Next.js 15 App Router · React 19 · TypeScript 5
 * strict · Tailwind CSS v4 CSS-first tokens). It renders a small "Tags" label
 * above a wrapping row of removable purple tag pills followed by an add-tag
 * text input. Typing a tag and pressing Enter (or typing a comma) commits it;
 * each pill's "×" control removes it.
 *
 * It is a LEAF composition component built ENTIRELY from two design-system
 * primitives — {@link TagPill} (the removable translucent-purple chip) and
 * {@link InputField} (the controlled add-tag input). It renders NO raw
 * `<input>`, `<button>`, or heading element of its own (AAP §0.4.5 — compose
 * from primitives only).
 *
 * UI-ONLY / MOCK (AAP §0.1.2 · §0.9)
 * --------------------------------------------------------------------------
 * There is no backend, no persistence, no network, and no autocomplete data
 * source. Adding/removing tags mutates ONLY the parent's React state via the
 * `onAddTag` / `onRemoveTag` callbacks (the `tags` array is fully controlled by
 * the parent `MetadataDialog`). The Calibre design-parity reference
 * `src/calibre/gui2/metadata/basic_widgets.py` (`TagsEdit`, ~L1508) is an
 * `EditWithComplete` comma-separated editor WITH completion; per the file
 * contract its autocomplete is deliberately NOT replicated — this is a plain
 * add-on-Enter/comma editor. Nothing is imported or translated from the Python
 * codebase; it informs behavior only (tags are "words or phrases, separated by
 * commas").
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * The editor owns interactive state (`useState` for the in-progress draft text)
 * and binds `onChange` / `onKeyDown` / `onRemove` event handlers, so it must be
 * a Client Component — App Router components default to Server Components, which
 * cannot run hooks or attach event handlers. The directive is the very first
 * line, before any import. The component is SSR-safe: the initial draft is the
 * empty-string literal, and there is no `window` / `Math.random` / `Date.now` /
 * `localStorage` access, so it hydrates without warnings.
 *
 * CONTROLLED TAGS, LOCAL DRAFT ONLY (the state contract)
 * --------------------------------------------------------------------------
 * The committed `tags` live in the PARENT — this component never copies them
 * into local state. The ONLY local state is the transient `draft` string being
 * typed before commit. Committing (Enter or comma) trims the draft, rejects an
 * empty value, de-duplicates case-insensitively against the existing `tags`,
 * calls `onAddTag(trimmed)` for a genuinely new tag, and always clears the
 * draft. This keeps the parent the single source of truth and guarantees the
 * pill list never contains a case-insensitive duplicate introduced here — so
 * the tag string is a stable, collision-free React `key`.
 *
 * FIGMA SOURCE OF TRUTH (file `JduUzjVHNhZivm5A0pAiCD`, page `0:1`)
 * --------------------------------------------------------------------------
 * Reconciled via analyze_figma_node on the App 07 modal (`9:9`), Tags region:
 *   • Label `9:80`            — the string "Tags" (Figma authors it uppercase
 *                               "TAGS"); rendered small + muted (see below).
 *   • Chips container `9:81`  — 580×38 box, fill `#181C3C`, 1px white@9% border,
 *                               radius 8px (= the default text-field box).
 *   • 5 pills `9:82…9:98`     — height 22px, fill `#7B61FF`@18%, border
 *                               `#7B61FF`@30% 1px, stadium radius, label
 *                               `#A78BFA` Inter Medium 10px + trailing "×".
 *     The inter-pill gap is 6px (confirmed across all four gaps).
 *   • Add-tag input           — HIDDEN: there is NO input node in the Figma
 *                               source. analyze_figma_node confirms the input is
 *                               caller-introduced and recommends placing it
 *                               inline after the pills, flex-growing to fill the
 *                               remaining width, with the same `#181C3C` /
 *                               white@9% / r8 box as the other fields — which is
 *                               exactly what the `InputField` primitive renders.
 * The pills' paint, stadium geometry, symmetric padding, content centering, and
 * "×" remove control are all realized INSIDE the `TagPill` primitive (the
 * analyze_figma_node "visually center the chip content / use symmetric padding"
 * recommendation is satisfied there), so this file only composes pills and owns
 * the label + the wrapping row layout.
 *
 * Per the file contract, AAP §0.3 has precedence over the subagent on
 * scope/intent; the EXACT layout (pills then add-input, on a flex-wrap row) is
 * taken from the contract, and the visible values map to `@theme` tokens below.
 *
 * BLITZY [DESIGN] (the "Tags" label): analyze_figma_node reports label `9:80` as
 * `#3A4060`, Inter SemiBold 600, 10px, authored uppercase. Two deliberate,
 * convention-aligned reconciliations are made:
 *   • COLOR + WEIGHT → `text-text-muted` (`#64748B`) + `text-meta-label`
 *     (Inter 400 / 10px). This matches BOTH the file contract's explicit
 *     directive AND the established codebase convention, where `text-text-muted`
 *     is the app-wide muted-LABEL token (WindowTitleBar, ConversionLog,
 *     ModalShell, Tabs, Button, PreferencesNav) and `--color-text-placeholder`
 *     (`#3A4060`) is RESERVED for input placeholders. Using the placeholder
 *     token for a label would break that convention; the weight delta (600→400)
 *     is imperceptible at 10px and matches the sibling meta-label usages.
 *   • CASE → the `uppercase` utility (text-transform only — carries no
 *     color/size token) honors Figma's authoritative uppercase field-label case
 *     on a dimension the contract leaves open, while the accessible DOM text
 *     stays "Tags".
 *
 * BLITZY [DESIGN] (the field box): the wrapping chip row carries the Figma
 * container `9:81` surface — `bg-card` (`#181C3C`) + 1px `--border-white-09`
 * border + `rounded-control` (8px) + 8px (`px-2`) left/right inset — so the
 * Tags field renders as ONE filled, bordered, rounded box wrapping the pills,
 * exactly like every sibling metadata field box. (The dialog-level
 * `compare_screenshot_with_figma` 9:9 flagged the absence of this box as the
 * single fidelity gap; it is resolved here with the identical token trio the
 * `InputField` primitive already uses, so ZERO hardcoded literals are added.)
 * The functional add-tag `InputField` nests inside this box to occupy the
 * trailing "type here" space; because it shares the `--color-card` fill it reads
 * as a seamless delineation of the type area, not a competing box. The box hugs
 * its 36px input to Figma's 38px height via `py-px` (1px top/bottom).
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every COLOR / TYPOGRAPHY value resolves to an `@theme` token from
 * `src/app/globals.css`: the label is `text-text-muted` (`--color-text-muted`)
 * + `text-meta-label` (`--text-meta-label`). The pill paint and the input
 * surface/border/radius/placeholder colors live INSIDE their primitives, so
 * this file declares no color/radius/typography literals at all. The only bare
 * utilities here are LAYOUT/appearance values that carry no color information —
 * Tailwind's standard spacing/flex scale (`flex`, `flex-wrap`, `flex-col`,
 * `items-center`, `w-full`, `gap-1.5`, `flex-1`, `min-w-32`) and the
 * `uppercase` text-transform — all permitted (matching the sibling primitives'
 * `px-2` / `gap-0.5` / `w-full` / `h-9` usage). `gap-1.5` (6px) reproduces the
 * confirmed 6px inter-pill gap exactly.
 *
 * RESPONSIVE INTEGRITY (1440 → 1280, zero horizontal overflow — AAP §0.9)
 * --------------------------------------------------------------------------
 * The chip row is `flex flex-wrap`, so pills wrap onto additional lines rather
 * than overflowing, and the trailing input (`flex-1 min-w-32`) grows to fill the
 * remaining row width and wraps to its own full-width line when little space
 * remains. The metadata column (~580px) far exceeds the 128px input minimum, so
 * there is never horizontal overflow as the window narrows to the 1280px floor.
 *
 * ACCESSIBILITY
 * --------------------------------------------------------------------------
 * • The "Tags" label is a non-interactive `<span>` (NOT a heading — it must not
 *   pollute the document outline). Visible label text is preserved for sighted
 *   users.
 * • The add-tag input is given an explicit `aria-label="Add a tag"` so the
 *   label-less `InputField` has a clear accessible name (the `InputField`
 *   primitive requires the caller to supply one).
 * • Each pill's remove affordance is a real, keyboard-operable `<button>` with
 *   an `aria-label` ("Remove <tag>") provided inside `TagPill`.
 * • Color is never the sole signal — pills carry their text label and an
 *   explicit remove control.
 *
 * @see src/components/primitives/TagPill.tsx   — the removable chip primitive.
 * @see src/components/primitives/InputField.tsx — the controlled input primitive.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 (App 07) / §0.4.2 — component & token mapping.
 */

import { useState } from 'react';
import type { JSX, KeyboardEvent } from 'react';

import { TagPill } from '@/components/primitives/TagPill';
import { InputField } from '@/components/primitives/InputField';

/**
 * Props for {@link TagChipEditor}.
 *
 * The committed tag list is fully CONTROLLED by the parent (`MetadataDialog`):
 * this component renders `tags` and reports add/remove intents through the two
 * callbacks. It deliberately exposes no value/variant styling props — the look
 * is fixed by the `TagPill` / `InputField` primitives and the design tokens.
 */
export interface TagChipEditorProps {
  /**
   * The current, controlled list of tags to render as removable pills. Owned by
   * the parent; this component never mutates or locally caches it. Expected to
   * be free of case-insensitive duplicates (this component guarantees it never
   * introduces one), so each tag string is used directly as a stable React key.
   */
  tags: string[];
  /**
   * Called with a trimmed, non-empty, non-duplicate tag string when the user
   * commits the draft (Enter or comma). The parent is responsible for appending
   * it to its `tags` state.
   */
  onAddTag: (tag: string) => void;
  /**
   * Called with the exact tag string when the user activates a pill's "×"
   * remove control. The parent is responsible for removing it from `tags`.
   */
  onRemoveTag: (tag: string) => void;
}

/**
 * Outer block: a full-width vertical stack holding the label above the chip
 * row. `gap-1` (4px) is the CONFIRMED Figma label→container layout gap (label
 * `9:80` bottom y=360 → container `9:81` top y=364); `w-full` lets the row span
 * the full metadata-column width so wrapping math has the real width.
 */
const CONTAINER_CLASSES = 'flex w-full flex-col gap-1';

/**
 * The "Tags" section label — token-backed muted small-caps. `text-text-muted`
 * (`#64748B`) is the app-wide muted-label color token; `text-meta-label`
 * (Inter 400 / 10px) is the meta-label type role; `uppercase` matches Figma's
 * uppercase field-label case (see the BLITZY [DESIGN] note in the file header).
 */
const LABEL_CLASSES = 'text-text-muted text-meta-label uppercase';

/**
 * The wrapping chip row, styled as the Figma "Tags" field box (node `9:81`).
 *
 * FIELD-BOX SURFACE (CONFIRMED from `analyze_figma_node` 9:81, reconfirmed by
 * the dialog-level `compare_screenshot_with_figma` 9:9): the Tags field renders
 * as a single filled + bordered + rounded box wrapping the pills (and, in this
 * functional prototype, the add-tag input). The exact same token trio the
 * `InputField` primitive uses for its surface is applied here so the box is
 * pixel-identical to every other metadata field box:
 *   • `bg-card`                       → `--color-card`       (#181C3C)         — Figma 9:81 fill
 *   • `border border-[var(--border-white-09)]` → `--border-white-09` (rgba 255,255,255,0.09) 1px — Figma 9:81 stroke
 *   • `rounded-control`               → `--radius-control`   (8px)            — Figma 9:81 radius
 * (The `border-[var(--border-white-09)]` arbitrary-value form is the codebase's
 * canonical, ZERO-hardcoded way to reference the `--border-white-09` token —
 * identical to `InputField`'s own surface declaration.)
 *
 * PADDING: `px-2` (8px) reproduces the CONFIRMED 8px inset from the box's left
 * edge to the first pill (and mirrors it on the right before the input).
 * `py-px` (1px) makes the box hug its content to the Figma height of 38px
 * (the 36px `InputField` + 1px top + 1px bottom = 38px) while keeping the
 * input's 1px border from coinciding exactly with the container's 1px border.
 *
 * LAYOUT: pills then the add-tag input, vertically centered (`items-center`),
 * with the CONFIRMED 6px (`gap-1.5`) inter-item gap. `flex-wrap` guarantees
 * zero horizontal overflow from 1440px down to the 1280px floor — pills and the
 * input reflow onto new lines (growing the box's height) instead of overflowing.
 */
const CHIP_ROW_CLASSES =
  'flex flex-wrap items-center gap-1.5 ' +
  'bg-card border border-[var(--border-white-09)] rounded-control ' +
  'px-2 py-px';

/**
 * Add-tag input sizing: `flex-1` grows it to fill the remaining row width after
 * the pills — occupying the ~228px empty "type here" area Figma leaves at the
 * end of the field box (node `9:81`) — and `min-w-32` (128px) keeps a
 * comfortable typing width; when less than that remains on the current line,
 * `flex-wrap` drops the input to its own full-width line. The input's surface,
 * border, radius, height, and placeholder color are owned by the `InputField`
 * primitive; because that surface uses the same `--color-card` fill as the
 * enclosing field box, the input reads as a seamless delineation of the type
 * area rather than a competing box. (The add-tag input has no Figma node of its
 * own — it is the functional realization of that trailing empty space.)
 */
const INPUT_WRAPPER_CLASSES = 'flex-1 min-w-32';

/** The placeholder shown in the empty add-tag input (AAP App 07 Tags field). */
const ADD_TAG_PLACEHOLDER = 'Add a tag\u2026';

/**
 * TagChipEditor — the App 07 Metadata Editor "Tags" chip editor.
 *
 * Renders a muted "Tags" label above a wrapping row of removable {@link TagPill}
 * chips (one per controlled `tags` entry) followed by a controlled
 * {@link InputField} for adding new tags. The only local state is the in-progress
 * `draft`; committed tags are owned by the parent and flow back in through
 * `tags`.
 *
 * @param props - {@link TagChipEditorProps}
 * @returns The rendered Tags chip editor.
 */
export function TagChipEditor({
  tags,
  onAddTag,
  onRemoveTag,
}: TagChipEditorProps): JSX.Element {
  // The ONLY local state: the transient text being typed before it is committed
  // as a tag. Committed tags live in the parent (controlled via `tags`).
  const [draft, setDraft] = useState('');

  /**
   * Commit the current draft as a tag. Trims surrounding whitespace; ignores an
   * empty result; de-duplicates case-insensitively against the existing `tags`
   * (so "Sci-Fi" is not added twice in different casing) and only forwards a
   * genuinely new tag to the parent. The draft is always cleared afterward so
   * the input resets even when the tag was a duplicate.
   */
  const commitDraft = (): void => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      return;
    }
    const alreadyPresent = tags.some(
      (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!alreadyPresent) {
      onAddTag(trimmed);
    }
    setDraft('');
  };

  /**
   * Commit the draft on Enter OR comma. `preventDefault` stops the comma
   * character from being inserted into the field (and stops any default Enter
   * behavior such as submitting a wrapping form), so the keystroke acts purely
   * as a "commit this tag" gesture — matching Calibre's comma-separated tags.
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitDraft();
    }
  };

  return (
    <div className={CONTAINER_CLASSES}>
      {/* Non-interactive section label (NOT a heading — keeps the document
          outline clean); visible text "Tags", displayed uppercase per Figma. */}
      <span className={LABEL_CLASSES}>Tags</span>

      <div className={CHIP_ROW_CLASSES}>
        {/* One removable pill per controlled tag. The tag string is a stable,
            collision-free key (the commit path never introduces a
            case-insensitive duplicate). The translucent-purple fill, stadium
            shape, and "×" remove control are all realized inside TagPill. */}
        {tags.map((tag) => (
          <TagPill
            key={tag}
            label={tag}
            removable
            onRemove={() => onRemoveTag(tag)}
          />
        ))}

        {/* The add-tag input. Fully controlled (`value`/`onChange`); commits on
            Enter/comma via `onKeyDown`. `aria-label` supplies the accessible
            name the label-less InputField requires. It grows to fill the row
            and wraps cleanly (flex-1 / min-w-32) for 1440→1280 integrity. */}
        <InputField
          variant="text"
          value={draft}
          onChange={setDraft}
          placeholder={ADD_TAG_PLACEHOLDER}
          aria-label="Add a tag"
          onKeyDown={handleKeyDown}
          className={INPUT_WRAPPER_CLASSES}
        />
      </div>
    </div>
  );
}

export default TagChipEditor;
