/**
 * `@/data/preferences` — default application settings for the Preferences screen (App06).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ──────────────────────────────────────────────────────────────────────────
 * Supplies the static default settings that seed `PreferencesProvider` and
 * render the Preferences screen (Figma node `8:2`):
 *
 *   • Default Font row — choices come from {@link fontOptions}; the active value
 *     is {@link defaultPreferences}.fontFamily / .fontSizePx.
 *   • 2×3 Reading-Behavior toggle grid — labels/order from
 *     {@link readingBehaviorOptions}; each toggle's on/off state from
 *     {@link defaultPreferences}.readingBehavior (every option `id` is a key).
 *   • Four Viewer-Theme swatches — enumerated by {@link viewerThemes}; the active
 *     swatch (purple border + checkmark) is {@link defaultPreferences}.viewerTheme.
 *   • Margins slider (purple-filled track) — start value
 *     {@link defaultPreferences}.marginsPx; the slider's min/max live in the
 *     `MarginsSlider`/`Slider` component, NOT here (typical range 0–128).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * UI-ONLY / MOCK DATA — IN-MEMORY DEFAULTS, NO PERSISTENCE
 * ──────────────────────────────────────────────────────────────────────────
 * These are in-memory defaults only. There is NO backend, NO database, NO API,
 * NO real settings file, and NO `localStorage` — `PreferencesProvider` holds the
 * live, editable copy in React state, initialized from this module. The module
 * is pure, deterministic, and SSR-safe: static literals only, with no randomness
 * and no time-dependent values. It carries no `'use client'` directive and
 * exposes only named exports (no default export).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The settings concepts parallel Calibre's desktop preferences — the look & feel
 * / reading-font options (`src/calibre/gui2/preferences/look_feel.py`) and the
 * behavior toggles (`src/calibre/gui2/preferences/behavior.py`) — but NO Python/
 * Qt code is imported, translated, or executed. Only the focused subset of
 * settings shown on App06 is modeled here (no scope creep beyond that screen).
 *
 * @see ./../types/index.ts — the {@link PreferencesState} / {@link ViewerTheme} contracts (`@/types`).
 * @see src/calibre/gui2/preferences/look_feel.py — Calibre look & feel (reference only).
 * @see src/calibre/gui2/preferences/behavior.py — Calibre behavior toggles (reference only).
 */

import type { PreferencesState, ViewerTheme } from '@/types';

/**
 * Default application preferences seeding `PreferencesProvider` (App06).
 *
 * In-memory defaults only (no persistence). The `readingBehavior` map holds
 * EXACTLY the six toggles rendered by the 2×3 behavior grid — four enabled and
 * two disabled — so the grid demonstrates both switch states out of the box.
 * Each `readingBehavior` key is mirrored, in grid order, by an entry in
 * {@link readingBehaviorOptions}.
 */
export const defaultPreferences: PreferencesState = {
  /** Default reading font — a safe, readable web-default serif (App06 Default Font row). */
  fontFamily: 'Georgia',
  /** Default reading font size, in pixels. */
  fontSizePx: 16,
  /**
   * The 2×3 Reading-Behavior toggle grid state, keyed by toggle id. Exactly six
   * keys (4 `true` / 2 `false`); the keys and their order are mirrored by
   * {@link readingBehaviorOptions}.
   */
  readingBehavior: {
    continuousScroll: true,
    showProgress: true,
    rememberPosition: true,
    highlightOnSelect: true,
    hyphenation: false,
    nightAutoDim: false,
  },
  /** Active viewer theme — the design's default `dark` swatch (purple border + checkmark). */
  viewerTheme: 'dark',
  /** Margins slider start value, in pixels — mid-range of the typical 0–128 track. */
  marginsPx: 64,
};

/**
 * Options for the Default Font dropdown (App06 look & feel row).
 *
 * `defaultPreferences.fontFamily` (`'Georgia'`) is guaranteed to be a member of
 * this list so the dropdown always opens on a valid selection. Inter — the
 * app's UI typeface — is offered here as a reading-font choice as well.
 */
export const fontOptions: string[] = [
  'Georgia',
  'Inter',
  'Merriweather',
  'Literata',
  'Times New Roman',
  'System Default',
];

/**
 * Ordered list of viewer themes backing the four `ThemeSwatch` swatches (App06).
 *
 * Order matches the `ViewerTheme` union declaration order. Typed as
 * `ViewerTheme[]` so every entry is checked against the union, and
 * `defaultPreferences.viewerTheme` is always a member.
 */
export const viewerThemes: ViewerTheme[] = ['dark', 'light', 'sepia', 'high-contrast'];

/**
 * Labels for the 2×3 Reading-Behavior toggle grid, in grid reading order
 * (row 1: continuousScroll, showProgress, rememberPosition; row 2:
 * highlightOnSelect, hyphenation, nightAutoDim).
 *
 * Each `id` MUST be a key of `defaultPreferences.readingBehavior`, which lets
 * the preferences panel map a label directly onto its toggle state without a
 * separate mapping layer.
 */
export const readingBehaviorOptions: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'continuousScroll', label: 'Continuous Scrolling' },
  { id: 'showProgress', label: 'Show Reading Progress' },
  { id: 'rememberPosition', label: 'Remember Last Position' },
  { id: 'highlightOnSelect', label: 'Highlight on Selection' },
  { id: 'hyphenation', label: 'Enable Hyphenation' },
  { id: 'nightAutoDim', label: 'Auto-Dim at Night' },
];
