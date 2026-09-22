# marianar.tech

Personal website for Mariana Ramirez Duque. Two pages: a home page with bio
and portrait, and `/links`.

## Stack

- **Next.js 16** (App Router) with `output: "export"` — the whole site is
  prerendered to static HTML at build time; there is no server at runtime.
- **Tailwind CSS v4** for layout and spacing, plus hand-written CSS in
  `app/globals.css` for color tokens, hover states, and the two-column grid.
- **TypeScript**, strict mode.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
```

## Build

```bash
npm run build   # static export to out/
npm run lint    # eslint (not run in CI)
```

To preview the exported site exactly as it deploys:

```bash
npm run build && (cd out && python3 -m http.server 3000)
```

## Structure

```
app/
  layout.tsx            root layout: font, metadata, the .site-shell <main>
  globals.css           color tokens, base type, hover states, grid, motion
  page.tsx              "/"      home — copy column + portrait
  links/page.tsx        "/links" date/title rows
  portrait.tsx          client — video/poster swap, tooltip, hover playback
  use-portrait-audio.ts client — hidden Spotify iframe controller
lib/content.ts          all site copy: bio, socials, links
brand/                  master icon artwork (not deployed)
```

All copy lives in `lib/content.ts` — the page components hold only structure.

Both routes share the one `<main>` in `layout.tsx`. The home page widens itself
to a two-column layout purely by rendering `.home-layout`, which a `:has()`
selector in `globals.css` matches; `/links` renders no such element and keeps
the narrow reading column. There is no per-route layout file.

Note that `html { font-size: 18px }` rescales every rem-based Tailwind spacing
utility by 12.5% — `px-6` renders at 27px, not 24px. Font sizes are stated
literally in JSX (`text-[18px]`) and are unaffected.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `out/` to GitHub Pages. The custom domain comes from `CNAME` at the
repo root, copied into `out/` by the workflow. CI does not run lint or tests.
