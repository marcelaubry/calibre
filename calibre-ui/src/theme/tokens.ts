/**
 * Calibre-UI Design System — TypeScript token mirror.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHAT THIS FILE IS
 * ──────────────────────────────────────────────────────────────────────────
 * Mirror of the `@theme` block in `src/app/globals.css` (authoritative).
 * Keep byte-consistent. Source: Figma `JduUzjVHNhZivm5A0pAiCD`, AAP §0.3.2.
 *
 * This module is a 1:1, TypeScript-side mirror of the bespoke dark-navy
 * glassmorphic design tokens declared — once, as CSS custom properties inside a
 * Tailwind CSS v4 `@theme { … }` block — in `src/app/globals.css`. CSS is the
 * styling channel of record for the application; nearly all UI should consume
 * tokens via Tailwind utility classes or `var(--token)` custom properties.
 *
 * These typed, frozen (`as const`) constants exist for the RARE cases where a
 * token value is needed in JavaScript/TypeScript rather than in CSS — for
 * example:
 *   • the deterministic placeholder-cover generator in `@/lib/covers`
 *     (computing tints / typographic overlays from a book's identity);
 *   • computed inline `style={{ … }}` values that cannot be expressed as a
 *     static class;
 *   • any canvas / SVG / chart drawing code that needs raw hex / rgba strings.
 *
 * Consumed via the `@/theme` path alias (`tsconfig.json` → `"@/*": ["./src/*"]`):
 *   import { colors, gradients, radii } from '@/theme/tokens';
 *   const indigo = colors.accentIndigo; // '#4838C8'
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HARD CONSTRAINTS (AAP §0.4.3 / §0.4.5)
 * ──────────────────────────────────────────────────────────────────────────
 * • EXACT-TOKEN FIDELITY — every value here is reproduced byte-for-byte from
 *   the AAP §0.3.2 Figma Token Manifest: zero approximation, zero snapping,
 *   zero rounding, zero color renaming. Hex digits stay UPPERCASE; rgba opacity
 *   forms are preserved verbatim (opacity such as zero-point-ten is NOT
 *   collapsed to zero-point-one); gradient strings preserve the `-45deg` angle
 *   and stop order exactly.
 * • BYTE-CONSISTENCY — `globals.css` is authoritative. If this file and
 *   `globals.css` ever diverge, `globals.css` wins. Both are authored from the
 *   same §0.3.2 manifest, so they match by construction.
 * • PURE DATA LEAF — this module imports NOTHING, runs no side effects at import
 *   time beyond declaring constants, renders no UI, and contains no JSX. It is
 *   framework-agnostic and intentionally carries NO client-component directive
 *   (it is safe to import from both Server and Client Components).
 * • BOUNDARY — per-book cover placeholder tints are NOT part of the named
 *   `@theme` token set and are deliberately NOT defined here; they belong to
 *   `@/lib/covers` (which may import named tokens such as `colors.accentIndigo`
 *   from this file but owns its own extra tint palette).
 *
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * The Calibre appearance/theme settings page (`src/calibre/gui2/preferences/
 * look_feel.py`) is a Qt controller cited for conceptual parity only; it holds
 * no design tokens and nothing here is imported, translated, or reused from it.
 * Every value below is 100% Figma-derived (AAP §0.3.2).
 *
 * @see src/app/globals.css — the authoritative `@theme` token declarations.
 * @see Agent Action Plan §0.3.2 — the Figma Token Manifest (single source of truth).
 */

// ---------------------------------------------------------------------------
// Colors — 29 named tokens (9 surfaces · 4 text · 3 accents · 13 semantic)
// ---------------------------------------------------------------------------
export const colors = {
  // surfaces / backgrounds
  bgApp: '#0C0E1A',
  titleBar: '#070810',
  surface1: '#10132A',
  surface2: '#13162E',
  card: '#181C3C',
  viewerBg: '#08080F',
  readingSurface: '#0F1020',
  codeBg: '#0A0B18',
  previewCream: '#F5F0E8',
  // text
  textPrimary: '#F1F5FF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textPlaceholder: '#3A4060',
  // accents
  accent: '#7B61FF',
  accentLight: '#A78BFA',
  accentIndigo: '#4838C8',
  // semantic — rating / format badges / danger
  star: '#F59E0B',
  formatEpub: '#4ADE80',
  formatMobi: '#FBBF24', // canonical MOBI token (amber); not the per-screen #A78BFA text styling
  formatPdf: '#F87171',
  danger: '#F87171',
  // semantic — FormatBadge opaque chip fills (Figma 3:87); badge TEXT stays on the bright format* tokens above
  formatEpubBg: '#1A2A1A',
  formatMobiBg: '#1A1A2E',
  formatPdfBg: '#2A1A1A',
  // semantic — Sidebar TagPill solid fill (Figma 2:36); distinct from the metadata accent wash
  tagSidebarBg: '#1D2148',
  // semantic — App 04 code-editor syntax theme
  syntaxTag: '#A78BFA',
  syntaxAttr: '#38BDF8',
  syntaxString: '#FBBF24',
  syntaxValue: '#4ADE80',
  syntaxComment: '#64748B',
  // semantic — macOS window traffic-light dots
  windowDotRed: '#FF5F57',
  windowDotAmber: '#FFBD2E',
  windowDotGreen: '#28CA41',
} as const;

// ---------------------------------------------------------------------------
// Gradients — 4 named tokens (distinct: `accent` ≠ `cta` ≠ `sliderTrack` ≠ `tabUnderline`)
// ---------------------------------------------------------------------------
export const gradients = {
  // accent gradient (e.g. CheckBadge fill) — ends in accent-light #A78BFA
  accent: 'linear-gradient(-45deg, #7B61FF 0%, #A78BFA 100%)',
  // primary CTA gradient (e.g. Read Now / Save) — ends in accent-indigo #4838C8
  cta: 'linear-gradient(-45deg, #7B61FF 0%, #4838C8 100%)',
  // Slider filled-track fill (App 06 margins slider) — bottom-up accent→accent-light
  // ramp. Mirrors `--gradient-slider-track`; consumed via `bg-gradient-slider-track`.
  sliderTrack: 'linear-gradient(to top, var(--color-accent), var(--color-accent-light))',
  // Active-tab underline (App04 editor 5:34 / App05 convert 6:28) — 2px vertical
  // accent→accent-light ramp. Mirrors `--gradient-tab-underline`; consumed via
  // the `bg-gradient-tab-underline` utility on the active tab's bottom child bar.
  tabUnderline: 'linear-gradient(0deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
} as const;

// ---------------------------------------------------------------------------
// Borders — 6 named tokens (preserve `0.04`/`0.06`/`0.07`/`0.09`/`0.10` exactly)
// ---------------------------------------------------------------------------
export const borders = {
  white04: 'rgba(255,255,255,0.04)', // App 07 "+ Add ID" quiet-box fill (9:115)
  white06: 'rgba(255,255,255,0.06)',
  white07: 'rgba(255,255,255,0.07)',
  white09: 'rgba(255,255,255,0.09)',
  white10: 'rgba(255,255,255,0.10)', // keep `0.10` — do NOT normalize to `0.1`
  accent: 'rgba(123,97,255,0.6)',
} as const;

// ---------------------------------------------------------------------------
// Scrims — 2 named tokens (modal overlay backdrops)
// ---------------------------------------------------------------------------
export const scrims = {
  convert: 'rgba(12,14,26,0.6)',
  metadata: 'rgba(0,0,0,0.55)',
} as const;

// ---------------------------------------------------------------------------
// Radii — 6 named tokens
// ---------------------------------------------------------------------------
export const radii = {
  badge: '3px',
  toolbar: '7px',
  // Shared 6px small-control radius: ModalShell close chip (6:15 / 9:19) +
  // App 07 "+ Add ID" quiet box (9:115).
  controlSm: '6px',
  control: '8px',
  card: '10px',
  dialog: '16px',
} as const;

// ---------------------------------------------------------------------------
// Shadows — 2 named tokens (dialog elevation)
// ---------------------------------------------------------------------------
export const shadows = {
  convert: '0 24px 64px rgba(0,0,0,0.6)',
  metadata: '0 20px 60px rgba(0,0,0,0.65)',
  // --shadow-input-glow · App 07 Metadata Title always-visible purple glow
  // (Figma 9:53; AAP §0.3.1/§0.7.4/§0.10.2). Accent #7B61FF = --color-accent.
  inputGlow: '0 0 0 3px rgba(123,97,255,0.25), 0 0 12px rgba(123,97,255,0.35)',
} as const;

// ---------------------------------------------------------------------------
// Sizes — 37 named component-geometry tokens (widths / heights / icon / ring)
// Mirror of the `--size-*` / `--ring-*` `@theme` vars in globals.css. Promoted
// from confirmed Figma pixel geometry so component TSX carries no bare px
// literal (AAP §0.4.5). Values are byte-consistent with globals.css. rem-authored
// design lengths are expressed in px (exact at the app's 16px root).
// ---------------------------------------------------------------------------
export const sizes = {
  windowDot: '11px',          // --size-window-dot         · WindowTitleBar traffic-light dot
  scrollbar: '10px',          // --size-scrollbar          · WebKit scrollbar width/height
  buttonH: '38px',            // --size-button-h           · primary/toolbar button height
  buttonCompactH: '32px',     // --size-button-compact-h   · secondary/danger compact height
  buttonQuietH: '28px',       // --size-button-quiet-h     · ghost/quiet button height (App 07 "+ Add ID" 9:115)
  toolbarButtonW: '84px',     // --size-toolbar-button-w   · toolbar button fixed min-width
  toolbarIcon: '15px',        // --size-toolbar-icon       · toolbar glyph size
  toggleKnob: '18px',         // --size-toggle-knob        · Toggle iOS knob diameter
  conversionLogMaxH: '140px', // --size-conversion-log-max-h · Convert dialog log max-height
  modalConvertW: '880px',     // --size-modal-convert-w    · Convert dialog width (6:9)
  modalConvertH: '740px',     // --size-modal-convert-h    · Convert dialog height (6:9)
  modalMetadataW: '860px',    // --size-modal-metadata-w   · Metadata dialog width (9:9)
  modalMetadataH: '800px',    // --size-modal-metadata-h   · Metadata dialog height (9:9)
  // Leaf-screen geometry (CP2 token-fidelity / R3):
  themeSwatchW: '154px',      // --size-theme-swatch-w     · App 06 ThemeSwatch tile width (8:82)
  themeSwatchH: '98px',       // --size-theme-swatch-h     · App 06 ThemeSwatch tile height (8:82)
  coverSmW: '20px',           // --size-cover-sm-w         · BookCoverPlaceholder `sm` width (2:2)
  coverSmH: '26px',           // --size-cover-sm-h         · BookCoverPlaceholder `sm` height (2:2)
  coverMdW: '182px',          // --size-cover-md-w         · BookCoverPlaceholder `md` width (3:82)
  coverMdH: '192px',          // --size-cover-md-h         · BookCoverPlaceholder `md` height (3:82)
  coverLgW: '196px',          // --size-cover-lg-w         · BookCoverPlaceholder `lg` width (2:347)
  coverLgH: '264px',          // --size-cover-lg-h         · BookCoverPlaceholder `lg` height (2:347)
  coverMetadataW: '178px',    // --size-cover-metadata-w   · BookCoverPlaceholder `metadata` width (9:21)
  coverMetadataH: '238px',    // --size-cover-metadata-h   · BookCoverPlaceholder `metadata` height (9:21)
  toolbarSearchW: '220px',    // --size-toolbar-search-w   · TopToolbar search field width (2:34)
  sidebarW: '216px',          // --size-sidebar-w          · App 01/02 Sidebar column width (2:36)
  detailPanelW: '236px',      // --size-detail-panel-w     · App 01/02 detail/batch panel width (2:345)
  filetreeW: '200px',         // --size-filetree-w         · FileTree column width (5:53)
  previewBasis: '504px',      // --size-preview-basis      · PreviewPane flex-basis width (5:131)
  tocBasis: '220px',          // --size-toc-basis          · TableOfContents flex-basis width (4:23)
  tocMinW: '192px',           // --size-toc-min-w          · TableOfContents min-width floor (4:23)
  readerToolsBasis: '372px',  // --size-reader-tools-basis · ReaderToolsPanel flex-basis width (4:56)
  readerToolsMinW: '320px',   // --size-reader-tools-min-w · ReaderToolsPanel min-width floor (4:56)
  readingProgressH: '3px',    // --size-reading-progress-h · ReadingArea progress-bar height (4:43)
  readingMeasure: '680px',    // --size-reading-measure    · ReadingArea prose max-width (4:43)
  editorLineH: '26px',        // --size-editor-line-h      · CodeEditor code/gutter row pitch (5:74)
  // CP4 Figma-fidelity geometry (R3):
  cardH: '256px',             // --size-card-h             · App 02 BookCard fixed card height (3:81)
  formatBadgeW: '40px',       // --size-format-badge-w     · FormatBadge fixed chip width (3:87)
  formatBadgeH: '16px',       // --size-format-badge-h     · FormatBadge fixed chip height (3:87)
  identifierKeyW: '90px',     // --size-identifier-key-w   · App 07 IdentifierRows key-field width (9:9)
  focusRingWidth: '3px',      // --ring-focus-width        · Slider thumb focus halo width
} as const;

// ---------------------------------------------------------------------------
// Spacing — 11 named component spacing/offset tokens
// Mirror of the `--space-*` `@theme` vars in globals.css (gaps, insets, the
// Toggle knob translation distance, and the file-tree/preview indents). Values
// are byte-consistent with globals.css.
// ---------------------------------------------------------------------------
export const spacing = {
  toolbarButtonGap: '5px',     // --space-toolbar-button-gap   · Button toolbar glyph→label gap
  chipY: '5px',                // --space-chip-y               · TagPill vertical padding
  toggleKnobInsetX: '4px',     // --space-toggle-knob-inset-x  · Toggle knob left inset
  toggleKnobInsetY: '3px',     // --space-toggle-knob-inset-y  · Toggle knob top inset
  toggleKnobTravel: '18px',    // --space-toggle-knob-travel   · Toggle knob horizontal travel
  windowTitleNudge: '3px',     // --space-window-title-nudge   · WindowTitleBar title vertical nudge
  conversionLogGap: '3px',     // --space-conversion-log-gap   · ConversionLog per-line gap
  conversionLogPb: '5px',      // --space-conversion-log-pb    · ConversionLog bottom inset
  // Leaf-screen spacing (CP2 token-fidelity / R3):
  filetreeIndentBase: '8px',   // --space-filetree-indent-base · FileTree base inline-start padding (5:53)
  filetreeIndentStep: '12px',  // --space-filetree-indent-step · FileTree per-depth indent step (5:53)
  previewIndent: '1.2em',      // --space-preview-indent       · PreviewPane paragraph text-indent (5:131)
} as const;

// ---------------------------------------------------------------------------
// Typography — global Inter font-family + 15 per-role text scales
// ---------------------------------------------------------------------------

/**
 * Global font-family string. References the `--font-inter` CSS variable set up
 * by `next/font/google` in `layout.tsx`, with safe system fallbacks.
 */
export const fontFamily =
  'var(--font-inter), Inter, system-ui, -apple-system, sans-serif' as const;

/**
 * Per-role text scales (AAP §0.3.2). Each role carries `fontWeight` (number) and
 * `fontSize` (px string); `lineHeight` (px string) is present ONLY for roles
 * whose line-height is specified in the manifest.
 */
export const typography = {
  windowTitle: { fontWeight: 500, fontSize: '11px' },
  // `dialogHeading` fontSize: manifest gives a ~18–22px range; pinned to 20px.
  // MUST remain identical to the `--text-dialog-heading` value in globals.css.
  dialogHeading: { fontWeight: 600, fontSize: '20px' },
  // `modalTitle` — App05/App07 modal title bar (Figma 6:9 / 9:9), Inter 600 16px.
  // MUST remain identical to the `--text-modal-title` value in globals.css.
  modalTitle: { fontWeight: 600, fontSize: '16px' },
  detailTitle: { fontWeight: 600, fontSize: '15px', lineHeight: '22px' },
  coverTitle: { fontWeight: 700, fontSize: '14px', lineHeight: '18px' },
  cardTitle: { fontWeight: 600, fontSize: '11px', lineHeight: '15px' },
  body: { fontWeight: 400, fontSize: '12px' },
  metaLabel: { fontWeight: 400, fontSize: '10px' },
  metaValue: { fontWeight: 500, fontSize: '10px' },
  // `fieldLabel` — App07 metadata field/section labels (Figma 9:80), Inter 600 10px.
  // MUST remain identical to the `--text-field-label` value in globals.css.
  fieldLabel: { fontWeight: 600, fontSize: '10px' },
  buttonPrimary: { fontWeight: 600, fontSize: '12px' },
  buttonSecondary: { fontWeight: 500, fontSize: '11px' },
  badge: { fontWeight: 500, fontSize: '8px' },
  toolbarLabel: { fontWeight: 400, fontSize: '9px' },
  readerBody: { fontWeight: 400, fontSize: '15px', lineHeight: '26px' },
} as const;

// ---------------------------------------------------------------------------
// Aggregate token object + derived literal types
// ---------------------------------------------------------------------------

/**
 * Aggregate of every token group, for ergonomic namespaced access:
 *   import tokens from '@/theme/tokens';
 *   tokens.colors.accent; tokens.radii.card;
 */
export const tokens = {
  colors,
  gradients,
  borders,
  scrims,
  radii,
  shadows,
  sizes,
  spacing,
  fontFamily,
  typography,
} as const;

/** Union of valid color token keys, e.g. `'bgApp' | 'accent' | …`. */
export type ColorToken = keyof typeof colors;
/** Union of valid gradient token keys: `'accent' | 'cta' | 'sliderTrack'`. */
export type GradientToken = keyof typeof gradients;
/** Union of valid border token keys, e.g. `'white06' | … | 'accent'`. */
export type BorderToken = keyof typeof borders;
/** Union of valid scrim token keys: `'convert' | 'metadata'`. */
export type ScrimToken = keyof typeof scrims;
/** Union of valid radius token keys, e.g. `'badge' | … | 'dialog'`. */
export type RadiusToken = keyof typeof radii;
/** Union of valid shadow token keys: `'convert' | 'metadata'`. */
export type ShadowToken = keyof typeof shadows;
/** Union of valid size token keys, e.g. `'windowDot' | … | 'focusRingWidth'`. */
export type SizeToken = keyof typeof sizes;
/** Union of valid spacing token keys, e.g. `'toolbarButtonGap' | … | 'conversionLogPb'`. */
export type SpacingToken = keyof typeof spacing;
/** Union of valid typography role keys, e.g. `'windowTitle' | … | 'readerBody'`. */
export type TypographyToken = keyof typeof typography;
/** The fully-typed shape of the aggregate `tokens` object. */
export type Tokens = typeof tokens;

export default tokens;
