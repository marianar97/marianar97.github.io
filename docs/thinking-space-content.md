# Thinking Space content

Writing lives in three folders under `content/thinking-space/`. The folder is the type: `books/`, `notes/`, and `links/`. The filename is the id, so `notes/mental-models.md` opens at `#note/mental-models`.

Each book has a Markdown file in `content/thinking-space/books/`. Put YAML properties between `---` lines at the very start:

```yaml
---
title: The Infinity Machine
subtitle: Demis Hassabis, DeepMind, and the Quest for Superintelligence
author: Sebastian Mallaby
genres:
  - Biography
  - Artificial Intelligence
---
```

Write paragraphs, headings, quotes, and lists below the closing `---`. On book pages, the title and properties appear beside the interactive cover; all writing appears underneath.

- `title` and `subtitle` become the book header.
- Other properties become labeled rows, in file order.
- Lists become tags; use a YAML list rather than comma-separated text.
- Booleans such as `favorite: true` become read-only checkboxes.
- Numbers display as numbers. Dates such as `finished: 2026-09-22` display as readable dates.
- HTTPS URLs become links. Other strings display as plain text.
- Empty values are omitted. Nested objects are not supported.

Properties display publicly: only include information you want on the website. The page is a reader; edit the Markdown file to change a property. Cover artwork and shelf metadata remain in `lib/thinking-space.ts`.

A note is a Markdown file in `content/thinking-space/notes/`. `title` and `subtitle` in its YAML become the sidebar label. Other YAML properties display above the writing. Notes are listed alphabetically by title.

A link is a Markdown file in `content/thinking-space/links/` with `title`, `date`, and `href`. The same files fill the Thinking Space links section and the homepage Links page. Links are listed alphabetically by title.

Parser checks: `node --experimental-strip-types --test tests/thinking-space-frontmatter.test.mjs`

## Adjusting the design

In `app/thinking-space/thinking-space.tsx`, edit the setting near the top:

```tsx
const ANNOTATION_WIDTH = 'max-w-[780px]';
```

Change `780` to your preferred width, or use `max-w-none` to fill the available space. Keep the whole Tailwind class as a literal string. Save to preview locally; rebuild to publish.

Layout, spacing, and navigation use Tailwind in `thinking-space.tsx`. Reading typography lives in `markdown-content.tsx`, and YAML property presentation in `document-properties.tsx`. The only CSS module, `book.module.css`, is for the 3D book geometry, materials, and effects.
