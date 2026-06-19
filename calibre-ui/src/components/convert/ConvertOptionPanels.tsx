'use client';

/**
 * ==========================================================================
 * Calibre-UI — ConvertOptionPanels
 * Concrete mock panels for the five non-"Look & Feel" Convert-dialog tabs.
 * ==========================================================================
 *
 * WHAT THIS IS
 * --------------------------------------------------------------------------
 * `ConvertOptionPanel` is the body renderer for the option-category tabs of the
 * App05 "Convert Books" dialog (Figma screen node `6:9`) in the UI-only Calibre
 * e-book-manager prototype (Next.js 15 App Router · React 19 · TypeScript 5
 * strict · Tailwind CSS v4 CSS-first `@theme` tokens). The dialog's first tab,
 * "Look & Feel", is rendered by its own {@link LookAndFeelPanel}; THIS module
 * supplies a fully-built, production-complete panel for each of the OTHER five
 * categories of {@link CONVERT_OPTION_TABS} so that NO tab ever renders a
 * placeholder card (CP3 forbids placeholders/stubs in production-complete
 * components):
 *
 *   • Heuristic Processing — a master enable switch, a 2-column grid of
 *     paragraph/markup heuristics, and a line-unwrap-factor range control.
 *   • Search & Replace      — two regex search→replace field pairs plus a
 *     case-sensitivity switch.
 *   • Table of Contents     — a force-auto-ToC switch, a "number of links" range
 *     control, and chapter / level XPath expression fields.
 *   • Metadata              — a compact title / author(s) / publisher / tags /
 *     series override form.
 *   • Output Options        — an output-profile dropdown, a flow-size range
 *     control, and cover/flow switches.
 *
 * Each category maps to a REAL Calibre conversion option group (design-parity
 * reference ONLY — never imported or translated): `src/calibre/gui2/convert/
 * heuristics.py`, `search_and_replace.py`, `toc.py`, `metadata.py`, and the
 * per-format `*_output.py` panels. We reproduce only the VISUAL subset; no
 * Python is reused.
 *
 * UI-ONLY / MOCK — NOTHING IS APPLIED
 * --------------------------------------------------------------------------
 * Every control is self-contained and INERT: each panel owns its own React
 * `useState` and nothing is persisted, applied, or fed into any real conversion
 * pipeline. There is NO file I/O, NO EPUB parsing, and NO option commit (AAP
 * §0.8.2) — the panels are purely demonstrative within the Convert dialog.
 *
 * WHY `'use client'`
 * --------------------------------------------------------------------------
 * Each panel owns interactive `useState` for its controls and binds change
 * handlers — client-only concerns (App Router components default to Server
 * Components, which cannot use hooks or attach handlers). The directive is the
 * very first line, before any import.
 *
 * ZERO-HARDCODED-TOKEN RULE (AAP §0.4.5)
 * --------------------------------------------------------------------------
 * Every color / radius / typography value resolves to an `@theme` token via a
 * Tailwind utility (`text-body`, `text-text-secondary`, `text-meta-label`,
 * `text-text-muted`) or a CSS-variable arbitrary value
 * (`bg-[var(--border-white-07)]`). The only bare literals are layout/spacing
 * utilities on Tailwind's standard scale (`flex`, `grid`, `gap-*`, `grid-cols-2`)
 * and the range bounds, which are numeric PROP VALUES (not design literals).
 * Every interactive control is composed from a design-system primitive
 * (`Toggle`, `Slider`, `InputField`, `Select`) — never a raw control (R4).
 *
 * @see src/components/convert/LookAndFeelPanel.tsx — the sibling first-tab panel.
 * @see src/components/convert/ConvertOptionTabs.tsx — the tab strip + labels.
 * @see src/components/primitives — Toggle · Slider · InputField · Select.
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3 / §0.7.4 App05 — Convert dialog spec.
 */

import { useId, useState, type JSX } from 'react';

import { Toggle } from '@/components/primitives/Toggle';
import { Slider } from '@/components/primitives/Slider';
import { InputField } from '@/components/primitives/InputField';
import { Select } from '@/components/primitives/Select';

/* --------------------------------------------------------------------------
 * Shared token-backed class strings (module scope so they are allocated once).
 * ------------------------------------------------------------------------ */

/** Panel shell: a full-width vertical stack matching the LookAndFeelPanel rhythm. */
const PANEL_BASE = 'flex w-full flex-col gap-u20';
/** A labeled control group (label stacked above its control). */
const CONTROL_STACK = 'flex flex-col gap-u6';
/** A control label — body type (Inter 400 / 12px) in the secondary text token. */
const LABEL_CLASSES = 'select-none text-body text-text-secondary';
/** A muted helper hint beneath a field — meta-label type (Inter 400 / 10px). */
const HINT_CLASSES = 'text-meta-label text-text-muted';
/** Two-column responsive grid for switch cells (mirrors the L&F processing grid). */
const TOGGLE_GRID = 'grid grid-cols-2 gap-x-u28 gap-y-u12';
/** A single switch cell: switch + wrapping label, baseline-aligned. */
const TOGGLE_CELL = 'flex min-w-0 items-center gap-u12 py-u2';
/** The switch's label text — body type, secondary token, wraps rather than clips. */
const TOGGLE_LABEL = 'select-none break-words text-body text-text-secondary';
/** Keeps a switch from shrinking beside its (flexible) label. */
const SWITCH_SHRINK = 'shrink-0';
/** Two-column field grid for compact form panels (Metadata / Search & Replace). */
const FIELD_GRID = 'grid grid-cols-2 gap-u16';
/** A field group that spans both grid columns (full-width inputs). */
const FIELD_FULL = 'col-span-2 flex flex-col gap-u6';
/** Hairline section divider — the house white-7% token, reset of the UA border. */
const DIVIDER_CLASSES = 'm-0 h-u1 border-0 bg-[var(--border-white-07)]';
/** A labeled sub-group heading inside a panel. */
const GROUP_LABEL = 'select-none text-body text-text-secondary';
/** Vertical group wrapper. */
const GROUP_STACK = 'flex flex-col gap-u12';

/* --------------------------------------------------------------------------
 * Panel 1 — Heuristic Processing
 * ------------------------------------------------------------------------ */

/** The heuristic on/off options shown in the 2-column switch grid. */
const HEURISTIC_TOGGLE_LABELS = [
  'Unwrap lines',
  'Detect and markup unwrapped lines',
  'Delete blank lines between paragraphs',
  'Format scene breaks',
  'Italicize common words',
  'Replace entity references',
] as const;

/**
 * Heuristic Processing panel — a master enable switch gating a grid of
 * paragraph/markup heuristics, plus a line-unwrap-factor range control.
 */
function HeuristicProcessingPanel(): JSX.Element {
  const fieldId = useId();
  const enableId = `${fieldId}-enable`;
  const unwrapId = `${fieldId}-unwrap`;

  const [enabled, setEnabled] = useState<boolean>(true);
  const [unwrapFactor, setUnwrapFactor] = useState<number>(40); // 0–100 → 0.00–1.00
  const [toggles, setToggles] = useState<boolean[]>([
    true,
    true,
    false,
    true,
    false,
    false,
  ]);

  const setToggleAt = (index: number, next: boolean): void => {
    setToggles((prev) => prev.map((value, i) => (i === index ? next : value)));
  };

  return (
    <div className={PANEL_BASE}>
      <div className={TOGGLE_CELL}>
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          ariaLabelledby={enableId}
          className={SWITCH_SHRINK}
        />
        <span id={enableId} className={TOGGLE_LABEL}>
          Enable heuristic processing
        </span>
      </div>

      <hr className={DIVIDER_CLASSES} />

      <div className={GROUP_STACK}>
        <span className={GROUP_LABEL}>Heuristics</span>
        <div className={TOGGLE_GRID}>
          {HEURISTIC_TOGGLE_LABELS.map((label, index) => {
            const id = `${fieldId}-heuristic-${index}`;
            return (
              <div key={label} className={TOGGLE_CELL}>
                <Toggle
                  checked={toggles[index]}
                  onChange={(next) => setToggleAt(index, next)}
                  ariaLabelledby={id}
                  disabled={!enabled}
                  className={SWITCH_SHRINK}
                />
                <span id={id} className={TOGGLE_LABEL}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className={DIVIDER_CLASSES} />

      <div className={CONTROL_STACK}>
        <label htmlFor={unwrapId} className={LABEL_CLASSES}>
          Line-unwrap factor (%)
        </label>
        <Slider
          id={unwrapId}
          value={unwrapFactor}
          min={0}
          max={100}
          step={5}
          showValue
          disabled={!enabled}
          onChange={setUnwrapFactor}
        />
        <span className={HINT_CLASSES}>
          Lines shorter than this fraction of the longest line are joined.
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Panel 2 — Search & Replace
 * ------------------------------------------------------------------------ */

/**
 * Search & Replace panel — two regex search→replacement field pairs plus a
 * case-sensitivity switch, mirroring Calibre's wizard rows.
 */
function SearchReplacePanel(): JSX.Element {
  const fieldId = useId();
  const search1Id = `${fieldId}-search-1`;
  const replace1Id = `${fieldId}-replace-1`;
  const search2Id = `${fieldId}-search-2`;
  const replace2Id = `${fieldId}-replace-2`;
  const caseId = `${fieldId}-case`;

  const [search1, setSearch1] = useState<string>('');
  const [replace1, setReplace1] = useState<string>('');
  const [search2, setSearch2] = useState<string>('');
  const [replace2, setReplace2] = useState<string>('');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  return (
    <div className={PANEL_BASE}>
      <div className={FIELD_GRID}>
        <div className={CONTROL_STACK}>
          <label htmlFor={search1Id} className={LABEL_CLASSES}>
            Search (regex)
          </label>
          <InputField
            id={search1Id}
            value={search1}
            onChange={setSearch1}
            placeholder="e.g. \\s{2,}"
          />
        </div>
        <div className={CONTROL_STACK}>
          <label htmlFor={replace1Id} className={LABEL_CLASSES}>
            Replace with
          </label>
          <InputField
            id={replace1Id}
            value={replace1}
            onChange={setReplace1}
            placeholder="e.g. a single space"
          />
        </div>

        <div className={CONTROL_STACK}>
          <label htmlFor={search2Id} className={LABEL_CLASSES}>
            Search (regex)
          </label>
          <InputField
            id={search2Id}
            value={search2}
            onChange={setSearch2}
            placeholder="Optional second pattern"
          />
        </div>
        <div className={CONTROL_STACK}>
          <label htmlFor={replace2Id} className={LABEL_CLASSES}>
            Replace with
          </label>
          <InputField
            id={replace2Id}
            value={replace2}
            onChange={setReplace2}
            placeholder="Optional replacement"
          />
        </div>
      </div>

      <hr className={DIVIDER_CLASSES} />

      <div className={TOGGLE_CELL}>
        <Toggle
          checked={caseSensitive}
          onChange={setCaseSensitive}
          ariaLabelledby={caseId}
          className={SWITCH_SHRINK}
        />
        <span id={caseId} className={TOGGLE_LABEL}>
          Case sensitive
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Panel 3 — Table of Contents
 * ------------------------------------------------------------------------ */

/**
 * Table of Contents panel — a force-auto-ToC switch, a "number of links" range
 * control, and chapter / level-1 XPath expression fields.
 */
function TableOfContentsPanel(): JSX.Element {
  const fieldId = useId();
  const forceId = `${fieldId}-force`;
  const linksId = `${fieldId}-links`;
  const chapterId = `${fieldId}-chapter`;
  const level1Id = `${fieldId}-level1`;

  const [forceAuto, setForceAuto] = useState<boolean>(false);
  const [maxLinks, setMaxLinks] = useState<number>(50);
  const [chapterXPath, setChapterXPath] = useState<string>('//h:h1 | //h:h2');
  const [level1XPath, setLevel1XPath] = useState<string>('');

  return (
    <div className={PANEL_BASE}>
      <div className={TOGGLE_CELL}>
        <Toggle
          checked={forceAuto}
          onChange={setForceAuto}
          ariaLabelledby={forceId}
          className={SWITCH_SHRINK}
        />
        <span id={forceId} className={TOGGLE_LABEL}>
          Force use of auto-generated Table of Contents
        </span>
      </div>

      <hr className={DIVIDER_CLASSES} />

      <div className={CONTROL_STACK}>
        <label htmlFor={linksId} className={LABEL_CLASSES}>
          Number of links to add to ToC
        </label>
        <Slider
          id={linksId}
          value={maxLinks}
          min={0}
          max={200}
          step={5}
          showValue
          onChange={setMaxLinks}
        />
      </div>

      <div className={CONTROL_STACK}>
        <label htmlFor={chapterId} className={LABEL_CLASSES}>
          Chapter XPath
        </label>
        <InputField
          id={chapterId}
          value={chapterXPath}
          onChange={setChapterXPath}
          placeholder="XPath expression for chapter detection"
        />
      </div>

      <div className={CONTROL_STACK}>
        <label htmlFor={level1Id} className={LABEL_CLASSES}>
          Level 1 ToC (XPath)
        </label>
        <InputField
          id={level1Id}
          value={level1XPath}
          onChange={setLevel1XPath}
          placeholder="Optional XPath for the top ToC level"
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Panel 4 — Metadata
 * ------------------------------------------------------------------------ */

/**
 * Metadata panel — a compact per-conversion metadata override form (title,
 * author(s), publisher, tags, series). Inert mock fields; nothing is committed.
 */
function MetadataOptionsPanel(): JSX.Element {
  const fieldId = useId();
  const titleId = `${fieldId}-title`;
  const authorId = `${fieldId}-author`;
  const publisherId = `${fieldId}-publisher`;
  const tagsId = `${fieldId}-tags`;
  const seriesId = `${fieldId}-series`;

  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [series, setSeries] = useState<string>('');

  return (
    <div className={PANEL_BASE}>
      <div className={FIELD_GRID}>
        <div className={CONTROL_STACK}>
          <label htmlFor={titleId} className={LABEL_CLASSES}>
            Title
          </label>
          <InputField
            id={titleId}
            value={title}
            onChange={setTitle}
            placeholder="Override the title"
          />
        </div>
        <div className={CONTROL_STACK}>
          <label htmlFor={authorId} className={LABEL_CLASSES}>
            Author(s)
          </label>
          <InputField
            id={authorId}
            value={author}
            onChange={setAuthor}
            placeholder="Override the author(s)"
          />
        </div>

        <div className={CONTROL_STACK}>
          <label htmlFor={publisherId} className={LABEL_CLASSES}>
            Publisher
          </label>
          <InputField
            id={publisherId}
            value={publisher}
            onChange={setPublisher}
            placeholder="Override the publisher"
          />
        </div>
        <div className={CONTROL_STACK}>
          <label htmlFor={seriesId} className={LABEL_CLASSES}>
            Series
          </label>
          <InputField
            id={seriesId}
            value={series}
            onChange={setSeries}
            placeholder="Override the series"
          />
        </div>

        <div className={FIELD_FULL}>
          <label htmlFor={tagsId} className={LABEL_CLASSES}>
            Tags
          </label>
          <InputField
            id={tagsId}
            value={tags}
            onChange={setTags}
            placeholder="Comma-separated tags"
          />
          <span className={HINT_CLASSES}>
            Separate multiple tags with commas (e.g. Sci-Fi, Classic).
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Panel 5 — Output Options
 * ------------------------------------------------------------------------ */

/** Output profiles offered by the mock output dropdown (Calibre device profiles). */
const OUTPUT_PROFILES = [
  'Default',
  'Kindle',
  'Kindle Paperwhite',
  'Tablet',
  'Kobo Reader',
  'Generic e-ink',
] as const;

/**
 * Output Options panel — an output-profile dropdown, a flow-size range control,
 * and cover/flow on/off switches.
 */
function OutputOptionsPanel(): JSX.Element {
  const fieldId = useId();
  const profileId = `${fieldId}-profile`;
  const flowId = `${fieldId}-flow`;
  const splitId = `${fieldId}-split`;
  const coverId = `${fieldId}-cover`;
  const aspectId = `${fieldId}-aspect`;

  const [profile, setProfile] = useState<string>('Default');
  const [flowSize, setFlowSize] = useState<number>(260); // KB
  const [splitOnFlow, setSplitOnFlow] = useState<boolean>(true);
  const [noDefaultCover, setNoDefaultCover] = useState<boolean>(false);
  const [preserveAspect, setPreserveAspect] = useState<boolean>(true);

  return (
    <div className={PANEL_BASE}>
      <div className={CONTROL_STACK}>
        <label htmlFor={profileId} className={LABEL_CLASSES}>
          Output profile
        </label>
        <Select
          id={profileId}
          value={profile}
          options={OUTPUT_PROFILES}
          onChange={setProfile}
        />
      </div>

      <div className={CONTROL_STACK}>
        <label htmlFor={flowId} className={LABEL_CLASSES}>
          Flow size (KB)
        </label>
        <Slider
          id={flowId}
          value={flowSize}
          min={0}
          max={512}
          step={8}
          showValue
          disabled={!splitOnFlow}
          onChange={setFlowSize}
        />
        <span className={HINT_CLASSES}>
          Split HTML files larger than this size into smaller flows.
        </span>
      </div>

      <hr className={DIVIDER_CLASSES} />

      <div className={GROUP_STACK}>
        <span className={GROUP_LABEL}>Cover &amp; flow</span>
        <div className={TOGGLE_GRID}>
          <div className={TOGGLE_CELL}>
            <Toggle
              checked={splitOnFlow}
              onChange={setSplitOnFlow}
              ariaLabelledby={splitId}
              className={SWITCH_SHRINK}
            />
            <span id={splitId} className={TOGGLE_LABEL}>
              Split files on flow size
            </span>
          </div>
          <div className={TOGGLE_CELL}>
            <Toggle
              checked={noDefaultCover}
              onChange={setNoDefaultCover}
              ariaLabelledby={coverId}
              className={SWITCH_SHRINK}
            />
            <span id={coverId} className={TOGGLE_LABEL}>
              No default cover
            </span>
          </div>
          <div className={TOGGLE_CELL}>
            <Toggle
              checked={preserveAspect}
              onChange={setPreserveAspect}
              ariaLabelledby={aspectId}
              className={SWITCH_SHRINK}
            />
            <span id={aspectId} className={TOGGLE_LABEL}>
              Preserve cover aspect ratio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Dispatcher
 * ------------------------------------------------------------------------ */

/**
 * Props for {@link ConvertOptionPanel}.
 */
export interface ConvertOptionPanelProps {
  /**
   * The active option-category label — one of the non-"Look & Feel" entries of
   * `CONVERT_OPTION_TABS`. "Look & Feel" is rendered by `LookAndFeelPanel` in the
   * dialog, so it is not handled here; any unrecognized value renders nothing.
   */
  activeTab: string;
}

/**
 * ConvertOptionPanel — renders the concrete mock panel for the active
 * non-"Look & Feel" Convert-dialog tab. Each panel is fully built (no
 * placeholders) and self-contained (its own `useState`), composed from
 * design-system primitives with every value resolving to an `@theme` token.
 *
 * @param props - {@link ConvertOptionPanelProps}
 * @returns The matching option panel, or `null` for an unrecognized tab (the
 *   dialog only ever routes the five non-"Look & Feel" labels here).
 */
export function ConvertOptionPanel({ activeTab }: ConvertOptionPanelProps): JSX.Element | null {
  switch (activeTab) {
    case 'Heuristic Processing':
      return <HeuristicProcessingPanel />;
    case 'Search & Replace':
      return <SearchReplacePanel />;
    case 'Table of Contents':
      return <TableOfContentsPanel />;
    case 'Metadata':
      return <MetadataOptionsPanel />;
    case 'Output Options':
      return <OutputOptionsPanel />;
    default:
      return null;
  }
}

export default ConvertOptionPanel;
