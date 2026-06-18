/**
 * `@/data/editorFiles` -- mock OEBPS/EPUB file set for the Book/EPUB Editor (App04).
 *
 * PURPOSE
 * Supplies the static, flat file list that seeds the EPUB Editor screen (Figma
 * node `5:2`). The hierarchy is encoded entirely by each node's `path`; the
 * editor components derive the tree from those paths at render time:
 *   - File Tree (node `5:53`) renders the folder/file hierarchy with each
 *     node's `name` and `sizeBytes`.
 *   - File Tabs (node `5:29`) show the open file's `name`.
 *   - Code Editor (node `5:74`, background `#0A0B18`) renders the selected
 *     file's `code`, syntax-highlighted by Shiki via `@/lib/highlight` using
 *     the file's `language`.
 *
 * UI-ONLY / MOCK DATA
 * A pure, deterministic, SSR-safe data module: static string literals only --
 * NO backend, NO real EPUB parsing, NO `fs`/`fetch`, NO randomness, and NO
 * time-dependent values. It carries no `'use client'` directive and exposes a
 * single named export (no default export).
 *
 * ORIGINAL CONTENT -- COPYRIGHT-SAFE BY DESIGN
 * The container / OPF / NCX markup follows the OPEN EPUB/OCF standards (those
 * formats are specifications, not copyrighted works -- safe to reproduce). The
 * XHTML body prose is ORIGINAL placeholder text written for this prototype:
 * generic, neutral, atmospheric science-fiction narrative. It does NOT
 * reproduce text from "Dune" or any other real, copyrighted book -- the OPF/NCX
 * merely carry a real book title/author as illustrative metadata.
 *
 * SCOPE NOTE ON LITERALS: the design-system rule "no hardcoded color/spacing
 * literals" governs the APP's own styling. It does NOT apply to the `code`
 * strings here. `stylesheet.css`'s `code` is sample EPUB FILE CONTENT shown in
 * the editor -- its CSS values (colors, px, font-family) are data, not app
 * styling, and are expected and correct.
 *
 * SHAPE & CONTRACT
 * A FLAT `EditorFile[]` of 10 nodes -- 4 folders + 6 files -- ordered so each
 * folder precedes its children. Folders use `kind:'folder'`, an empty `code`,
 * an empty `language`, and `sizeBytes: 0`. Files use `kind:'file'` with
 * `language` in {'html','xml','css'} -- the exact grammar set loaded by
 * `@/lib/highlight` ('xml' for .opf/.ncx/.xml, 'html' for .xhtml, 'css' for
 * .css). `sizeBytes` is the UTF-8 byte length of each `code`. The `language`
 * field is the contract between this data and `@/lib/highlight`'s
 * `codeToHtml(code, language)` grammar set.
 *
 * The two HTML chapter files additionally carry `previewBlocks` -- a STRUCTURED
 * (heading + paragraph) representation of their `<body>` consumed by the cream
 * `PreviewPane` (App04, node `5:131`). The pane renders these as real React
 * elements, so it never injects raw HTML (no `dangerouslySetInnerHTML`); the
 * `code` string remains the source of truth for the Shiki-highlighted code view.
 * `previewBlocks` is present only on `language:'html'` files.
 *
 * DESIGN-PARITY REFERENCE ONLY -- NOT CODE REUSE
 * The OEBPS categories modeled here (Text `.xhtml`, Styles `.css`, plus the OPF
 * package and NCX nav) parallel Calibre's desktop editor file browser
 * (`src/calibre/gui2/tweak_book/file_list.py`, whose `category_defs()` groups
 * Text / Styles / Images / Fonts and which surfaces the OPF and NCX). NO
 * Python/Qt code is imported, translated, or executed -- only the conceptual
 * structure is reproduced as original mock data.
 *
 * @see ../types/index.ts -- the `EditorFile` contract (`@/types`).
 * @see ../lib/highlight.ts -- `codeToHtml`; supported langs ['html','xml','css'].
 * @see src/calibre/gui2/tweak_book/file_list.py -- Calibre editor file list (reference only).
 */

import type { EditorFile } from '@/types';

/**
 * The mock OEBPS file tree opened in the EPUB Editor (App04).
 *
 * Flat and ordered folders-before-children so the `FileTree` renders the
 * hierarchy naturally top-to-bottom. Exactly 10 nodes: 4 folders + 6 files.
 */
export const editorFiles: EditorFile[] = [
  {
    path: 'META-INF',
    name: 'META-INF',
    kind: 'folder',
    language: '',
    sizeBytes: 0,
    code: '',
  },
  {
    path: 'META-INF/container.xml',
    name: 'container.xml',
    kind: 'file',
    language: 'xml',
    sizeBytes: 251,
    code: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
  },
  {
    path: 'OEBPS',
    name: 'OEBPS',
    kind: 'folder',
    language: '',
    sizeBytes: 0,
    code: '',
  },
  {
    path: 'OEBPS/content.opf',
    name: 'content.opf',
    kind: 'file',
    language: 'xml',
    sizeBytes: 1116,
    code: `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>Dune</dc:title>
    <dc:creator opf:role="aut" opf:file-as="Herbert, Frank">Frank Herbert</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid" opf:scheme="UUID">urn:uuid:9f8e7d6c-5b4a-3c2d-1e0f-a1b2c3d4e5f6</dc:identifier>
    <dc:publisher>Calibre UI Prototype Press</dc:publisher>
    <dc:date>1965-08-01</dc:date>
    <meta name="cover" content="cover-image"/>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="styles/stylesheet.css" media-type="text/css"/>
    <item id="chapter-001" href="text/chapter-001.xhtml" media-type="application/xhtml+xml"/>
    <item id="chapter-002" href="text/chapter-002.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter-001"/>
    <itemref idref="chapter-002"/>
  </spine>
</package>`,
  },
  {
    path: 'OEBPS/toc.ncx',
    name: 'toc.ncx',
    kind: 'file',
    language: 'xml',
    sizeBytes: 822,
    code: `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
  <head>
    <meta name="dtb:uid" content="urn:uuid:9f8e7d6c-5b4a-3c2d-1e0f-a1b2c3d4e5f6"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>Dune</text>
  </docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel>
        <text>Chapter 1 — Arrakis</text>
      </navLabel>
      <content src="text/chapter-001.xhtml"/>
    </navPoint>
    <navPoint id="navpoint-2" playOrder="2">
      <navLabel>
        <text>Chapter 2 — The Gathering Dark</text>
      </navLabel>
      <content src="text/chapter-002.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`,
  },
  {
    path: 'OEBPS/text',
    name: 'text',
    kind: 'folder',
    language: '',
    sizeBytes: 0,
    code: '',
  },
  {
    path: 'OEBPS/text/chapter-001.xhtml',
    name: 'chapter-001.xhtml',
    kind: 'file',
    language: 'html',
    sizeBytes: 1534,
    code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Chapter 1 — Arrakis</title>
    <link rel="stylesheet" type="text/css" href="../styles/stylesheet.css"/>
  </head>
  <body>
    <h1>Chapter 1 — Arrakis</h1>
    <p>The shuttle came down through a sky the color of beaten brass, and the first thing she noticed was the silence. No birds, no wind through leaves, only the dry hiss of sand moving against the hull as the engines cooled. Beyond the landing field the dunes ran out to the horizon in long unbroken waves, and the heat stood over them like something with weight and intention.</p>
    <p>Here water was not a thing you drank without thinking; it was counted, hoarded, and remembered. The people who met them at the gate wore their stillness like armor, their eyes shadowed beneath hoods bleached pale by the sun. They spoke little and watched everything, and in their economy of motion she read a lesson the green worlds had never taught her: that to waste was to die.</p>
    <p>She had come to govern, or so the documents said, but standing on that scorched ground she understood that the planet would do the governing. It tested every newcomer the same patient way, drying the soft places, narrowing the careless, until only those who had learned its rules remained. She breathed the burning air and promised herself, without quite knowing why, that she would learn them too.</p>
  </body>
</html>`,
    previewBlocks: [
      { type: 'h1', text: 'Chapter 1 — Arrakis' },
      { type: 'p', text: 'The shuttle came down through a sky the color of beaten brass, and the first thing she noticed was the silence. No birds, no wind through leaves, only the dry hiss of sand moving against the hull as the engines cooled. Beyond the landing field the dunes ran out to the horizon in long unbroken waves, and the heat stood over them like something with weight and intention.' },
      { type: 'p', text: 'Here water was not a thing you drank without thinking; it was counted, hoarded, and remembered. The people who met them at the gate wore their stillness like armor, their eyes shadowed beneath hoods bleached pale by the sun. They spoke little and watched everything, and in their economy of motion she read a lesson the green worlds had never taught her: that to waste was to die.' },
      { type: 'p', text: 'She had come to govern, or so the documents said, but standing on that scorched ground she understood that the planet would do the governing. It tested every newcomer the same patient way, drying the soft places, narrowing the careless, until only those who had learned its rules remained. She breathed the burning air and promised herself, without quite knowing why, that she would learn them too.' },
    ],
  },
  {
    path: 'OEBPS/text/chapter-002.xhtml',
    name: 'chapter-002.xhtml',
    kind: 'file',
    language: 'html',
    sizeBytes: 1577,
    code: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Chapter 2 — The Gathering Dark</title>
    <link rel="stylesheet" type="text/css" href="../styles/stylesheet.css"/>
  </head>
  <body>
    <h1>Chapter 2 — The Gathering Dark</h1>
    <p>Night fell on the desert the way a door closes, all at once and without apology. The heat that had ruled the day fled upward into a sky thick with unfamiliar stars, and in its place came a cold so sudden and complete that it felt less like the absence of warmth than the arrival of something else entirely. The dunes turned from gold to iron, and the wind found its voice.</p>
    <p>Far out among the shadowed ridges, lights moved that belonged to no settlement she had been shown on any map. They blinked and slid and vanished, patient as predators, and the watchers on the wall followed them without speaking. There were old quarrels in this place, she had been told, debts and loyalties older than the charters that pretended to govern them, and tonight the desert seemed to be keeping a count of its own.</p>
    <p>She did not sleep. She sat by the narrow window while the cold deepened and the strange lights kept their distance, and she turned the day's lessons over in her mind like stones. Whatever was coming would not announce itself; it would arrive the way the night had arrived, complete and unarguable, and the only question that mattered was whether she would meet it standing.</p>
  </body>
</html>`,
    previewBlocks: [
      { type: 'h1', text: 'Chapter 2 — The Gathering Dark' },
      { type: 'p', text: 'Night fell on the desert the way a door closes, all at once and without apology. The heat that had ruled the day fled upward into a sky thick with unfamiliar stars, and in its place came a cold so sudden and complete that it felt less like the absence of warmth than the arrival of something else entirely. The dunes turned from gold to iron, and the wind found its voice.' },
      { type: 'p', text: 'Far out among the shadowed ridges, lights moved that belonged to no settlement she had been shown on any map. They blinked and slid and vanished, patient as predators, and the watchers on the wall followed them without speaking. There were old quarrels in this place, she had been told, debts and loyalties older than the charters that pretended to govern them, and tonight the desert seemed to be keeping a count of its own.' },
      { type: 'p', text: 'She did not sleep. She sat by the narrow window while the cold deepened and the strange lights kept their distance, and she turned the day\'s lessons over in her mind like stones. Whatever was coming would not announce itself; it would arrive the way the night had arrived, complete and unarguable, and the only question that mattered was whether she would meet it standing.' },
    ],
  },
  {
    path: 'OEBPS/styles',
    name: 'styles',
    kind: 'folder',
    language: '',
    sizeBytes: 0,
    code: '',
  },
  {
    path: 'OEBPS/styles/stylesheet.css',
    name: 'stylesheet.css',
    kind: 'file',
    language: 'css',
    sizeBytes: 832,
    code: `@charset "UTF-8";

/* Base reading styles for the sample EPUB shown in the editor preview pane. */
body {
  font-family: "Georgia", "Iowan Old Style", "Times New Roman", serif;
  line-height: 1.6;
  margin: 1.2em 1.5em;
  color: #1b1b1b;
  background-color: #f5f0e8;
  text-rendering: optimizeLegibility;
  -webkit-hyphens: auto;
  hyphens: auto;
}

h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 1.75em;
  font-weight: 700;
  line-height: 1.25;
  margin: 1.5em 0 0.8em;
  text-align: left;
  page-break-before: always;
  color: #2a2a2a;
}

p {
  margin: 0;
  text-align: justify;
  text-indent: 1.2em;
  orphans: 2;
  widows: 2;
}

h1 + p,
p.first-line {
  text-indent: 0;
}

blockquote {
  margin: 1em 1.8em;
  padding-left: 0.8em;
  border-left: 2px solid #c8b89a;
  font-style: italic;
  color: #44413a;
}`,
  },
];
