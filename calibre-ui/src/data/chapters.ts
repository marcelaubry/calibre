/**
 * `@/data/chapters` — mock reader chapters for the E-book Viewer (App03).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ──────────────────────────────────────────────────────────────────────────
 * Supplies the static chapter list that seeds `ReaderProvider` and drives the
 * E-book Viewer screen (Figma node `4:2`):
 *
 *   • Table of Contents (node `4:23`) renders each chapter's {@link Chapter.title}.
 *   • Reading Area (node `4:43`, surface `#0F1020`, justified 15px/26px body)
 *     renders the selected chapter's {@link Chapter.body} as React `<p>`/`<mark>`
 *     elements (no raw-HTML injection).
 *   • Reader Tools panel renders reading-progress statistics derived from
 *     {@link Chapter.wordCount}.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * UI-ONLY / MOCK DATA
 * ──────────────────────────────────────────────────────────────────────────
 * This is a pure, deterministic, SSR-safe data module: static string literals
 * only — NO backend, NO real EPUB parsing, NO `fetch`, NO randomness, and NO
 * time-dependent values. It carries no `'use client'` directive and exposes a
 * single named export (no default export).
 *
 * ──────────────────────────────────────────────────────────────────────────
 * ORIGINAL PROSE — COPYRIGHT-SAFE BY DESIGN
 * ──────────────────────────────────────────────────────────────────────────
 * Every chapter `body` below is ORIGINAL placeholder prose written for this
 * prototype — generic, neutral, atmospheric science-fiction narrative. It does
 * NOT reproduce text from Dune or any other real, copyrighted book. The viewer
 * may display a real book's *title* in its header, but the body rendered here is
 * deliberately illustrative mock text; this is the correct, copyright-safe
 * choice for a UI-only prototype.
 *
 * The body is STRUCTURED data, not a raw HTML string: each chapter `body` is an
 * ordered list of paragraphs, and each paragraph is a list of inline runs
 * (`{ text, highlight? }`). The reading area maps these to real React
 * `<p>`/`<mark>` elements — so there is NO `dangerouslySetInnerHTML` anywhere in
 * the viewer (the only sanctioned raw-HTML sink in the app is the Shiki-rendered
 * `CodeEditor`). The runs carry no inline styles, colors, or hex literals — the
 * reading area applies `text-align: justify` and the reader body type via design
 * tokens in the component. Exactly one early chapter (the Prologue) marks a
 * single run with `highlight: true` to demonstrate the "highlighted passage"
 * shown in Figma `4:43`; the highlight color is applied by the component/tokens,
 * not here.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * PROGRESS ANCHOR (lives in ReaderProvider, NOT here)
 * ──────────────────────────────────────────────────────────────────────────
 * The viewer's ~29% reading-progress indicator (Figma `4:43`) is owned by
 * `ReaderProvider` (current chapter index / progress). This module only
 * guarantees the chapter *count* needed to support that anchor: with 7 chapters,
 * `Math.round((2 / 7) * 100) === 29`, so an early chapter (index 2) lands near
 * 29%. No percentage value is stored in this file.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN-PARITY REFERENCE ONLY — NOT CODE REUSE
 * ──────────────────────────────────────────────────────────────────────────
 * The chapter/TOC concept parallels Calibre's desktop viewer TOC model
 * (`src/calibre/gui2/viewer/toc.py`, whose tree items expose a `.title`), but no
 * Python/Qt code is imported, translated, or executed here.
 *
 * @see ./../types/index.ts — the {@link Chapter} contract (`@/types`).
 * @see src/calibre/gui2/viewer/toc.py — Calibre viewer TOC (reference only).
 */

import type { Chapter } from '@/types';

/**
 * The mock chapter list for the single book opened in the viewer.
 *
 * Exactly 7 chapters (`ch-1`…`ch-7`). Order is meaningful: index 0 is the
 * prologue and index 6 is the epilogue, with the body chapters in between. The
 * TOC, reading area, and progress stats all consume this array as-is.
 */
export const chapters: Chapter[] = [
  {
    id: 'ch-1',
    title: 'Prologue — The Signal',
    body: [
      { runs: [{ text: 'The signal arrived long after the station had gone quiet, a thin thread of sound threading through the dark between the stars. No one had expected it, and so at first no one believed it. The instruments recorded it patiently anyway, the way instruments do, indifferent to wonder.' }] },
      { runs: [{ text: 'She watched the readout climb and fall and climb again, and felt the old familiar pull of a question that refused to be set aside. ' }, { text: 'Somewhere out there, something had spoken, and it had used a language older than the colonies.', highlight: true }, { text: ' The thought settled into her like ballast, steadying and heavy at once.' }] },
      { runs: [{ text: 'By morning the whole crew would know. By evening they would have to decide what to do about it. For now there was only the hum of the deck plates and the slow turning of a world that did not yet understand how much was about to change.' }] },
    ],
    wordCount: 149,
  },
  {
    id: 'ch-2',
    title: 'Chapter 1 — Departure',
    body: [
      { runs: [{ text: 'They cast off at the grey edge of the station\'s morning, when the docking lights still burned against a sky that held no dawn. The mooring clamps released one by one, each with a small shudder that travelled the length of the hull, and then there was nothing holding them to anything at all.' }] },
      { runs: [{ text: 'For a while the harbor of lights fell away behind them, a scattering of windows and gantries shrinking into a single bright point, and then into none. The crew moved through their duties with the quiet economy of people who had done this before and knew better than to speak of what they were leaving. Departure, she had learned, was a thing best met with work.' }] },
      { runs: [{ text: 'When the last of the inner beacons slipped below the horizon of instruments, the ship settled into its long attitude and the engines found their patient note. Ahead lay only distance, measured not in miles but in months, and the slow certainty that the place they were going would not be the place they remembered when they returned.' }] },
    ],
    wordCount: 178,
  },
  {
    id: 'ch-3',
    title: 'Chapter 2 — The Long Dark',
    body: [
      { runs: [{ text: 'The dark between worlds was not empty, though it was often called so. It was full of small sounds — the breath of the recyclers, the tick of cooling metal, the murmur of a hundred systems keeping the living alive — and full, too, of a silence underneath all of it that had no bottom.' }] },
      { runs: [{ text: 'Days lost their edges. The crew kept to the clocks because the clocks were all they had, eating when the schedule said to eat and sleeping when it said to sleep, and in between they watched the same stars hang motionless in the ports, so far away that even at this speed they never seemed to move.' }] },
      { runs: [{ text: 'She found that the mind, given enough emptiness, would fill it with whatever it carried. Some of the crew dreamed of home. Some dreamed of the signal. She dreamed of neither, and woke each shift with the sense of having understood something in her sleep that daylight would not let her keep.' }] },
    ],
    wordCount: 164,
  },
  {
    id: 'ch-4',
    title: 'Chapter 3 — Dust and Glass',
    body: [
      { runs: [{ text: 'The world they reached was a ruin, and it had been a ruin for a very long time. From orbit it showed as a pale disc streaked with the grey of old weather, and as they descended the streaks resolved into the bones of something that had once been built and tended and then, somehow, abandoned.' }] },
      { runs: [{ text: 'They walked among towers of dust and glass, through avenues where the wind had been the only traveller for centuries. The domes had failed gracefully, sagging rather than shattering, and beneath them lay gardens turned to powder and benches where no one would ever sit again. It was not frightening. It was only very quiet, and very sad, in the way of a question asked and never answered.' }] },
      { runs: [{ text: 'She gathered what the instruments asked her to gather and tried not to imagine the hands that had set each stone. Whatever had spoken across the dark had not spoken from here. But here, she thought, was a warning, or perhaps only a mirror, held up across the years for anyone with the patience to look.' }] },
    ],
    wordCount: 180,
  },
  {
    id: 'ch-5',
    title: 'Chapter 4 — The Inner System',
    body: [
      { runs: [{ text: 'Turning inward again felt like waking. The cold gave way by degrees to the thin warmth of a true sun, and the ports that had shown only blackness for so long began to fill with the small, busy traffic of the inhabited worlds — freighters and tugs and the bright needles of couriers, all of them going somewhere with a confidence the long dark had taught her to distrust.' }] },
      { runs: [{ text: 'The radio, silent for months, woke into a clamor of voices, schedules, and complaints, the ordinary noise of people too close together. After the great quiet it was almost unbearable, and almost beautiful, and she sat for a long time simply listening to strangers argue about nothing, grateful in a way she could not have explained.' }] },
      { runs: [{ text: 'Home was still far, but it was no longer abstract. It had a color now, and a weather, and a particular slant of light she had not let herself remember until the distance grew small enough to make remembering safe.' }] },
    ],
    wordCount: 165,
  },
  {
    id: 'ch-6',
    title: 'Chapter 5 — Thresholds',
    body: [
      { runs: [{ text: 'Every journey, she thought, ended not at a place but at a threshold, a line you crossed knowing you could not uncross it. They had carried the signal back across the dark, and now they would have to set it down in front of people who had spent those months living ordinary lives, untouched by the question that had hollowed out the crew.' }] },
      { runs: [{ text: 'There were arguments about what to say and how much. Some wanted to give it all at once, the whole strange weight of it. Others wanted to release it slowly, a fact at a time, the way you let light into a room where someone has been sleeping. She listened to both and found she agreed with neither and could not yet say why.' }] },
      { runs: [{ text: 'In the end the choice was simpler than the arguing had made it seem. You told the truth, and you told it plainly, and you trusted the people you told to be braver than your fear of them. That, too, was a threshold, and she stood at it a long while before she stepped across.' }] },
    ],
    wordCount: 182,
  },
  {
    id: 'ch-7',
    title: 'Epilogue — Homecoming',
    body: [
      { runs: [{ text: 'Homecoming was not the ending she had imagined through all the months of dark. There were no crowds, no banners, only a docking bay much like the one they had left, and the same grey morning light, and the small relief of gravity that meant a floor would stay a floor. She walked out into it and found the world had gone on without her, as worlds do.' }] },
      { runs: [{ text: 'The signal belonged to everyone now. It had been studied and argued over and folded into the slow machinery of human understanding, and somewhere in that folding it had stopped being hers. She did not mind as much as she had feared. Some things are too large to be owned, and are only carried for a while, and then handed on.' }] },
      { runs: [{ text: 'At night she still looked up, out of habit and out of something deeper than habit, toward the dark she had crossed and would not cross again. Whatever had spoken was still out there, patient as the instruments, waiting for an answer the colonies had only begun to learn how to give. It was enough, she decided, to have heard. The rest belonged to those who came after.' }] },
    ],
    wordCount: 197,
  },
];
