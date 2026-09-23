# Thinking Space content

Each book has a Markdown file in `content/thinking-space/`. Put YAML properties between `---` lines at the very start:

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

General notes still work without YAML. Adding YAML to a general note displays its properties above its Markdown content.

Parser checks: `node --experimental-strip-types --test tests/thinking-space-frontmatter.test.mjs`
