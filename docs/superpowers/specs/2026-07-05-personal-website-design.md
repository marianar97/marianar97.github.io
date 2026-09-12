# Personal Website — Design Spec

**Date:** 2026-07-05
**Goal:** A personal website for Mariana Ramirez that replicates the visual design of annebrandes.com exactly, with Mariana's content.

## Overview

A single static page: centered 480px column, name + social icons, obfuscated email, three bio paragraphs, and a two-row "recent work" list. Built with Next.js 15 (App Router, TypeScript) + Tailwind CSS v4, statically exported.

## Content

All content lives in `lib/content.ts` — the single file to edit for any data change.

### Header

- **Display name / page title:** Mariana Ramirez
- **Social icons (in order):** GitHub → `https://github.com/marianar97`, LinkedIn → `https://www.linkedin.com/in/marianaramirezd/`, X → `https://x.com/marianaramd`
- **Email line (obfuscated text, not a mailto link):** `mariana.ramirezd97 [at] gmail [dot] com`

### Bio (3 paragraphs; inline links noted)

1. "I'm a founding engineer at [Fulcrum](https://www.withfulcrum.com). We're building AI that automates manual workflows for insurance brokers, so teams can scale their accounts without scaling their headcount. If you're interested in joining the team, reach out to my email."
2. "Previously, I worked at startups (YC) and big companies ([SoFi](https://www.sofi.com)). I earned my master's at [Carnegie Mellon](https://www.cmu.edu)."
3. "I'm from Medellín, Colombia, and I wrote my first program at 13 with Lego Mindstorms after watching The Social Network. Outside of work, you'll find me digging into open-source projects and going down rabbit holes in history and philosophy."

### Recent work rows

| Title | Date label | Source label | Link |
|---|---|---|---|
| Digital Garden | AUG 2025 | GITHUB | https://github.com/marianar97/digital-garden |
| Etube | MAY 2024 | GITHUB | https://github.com/marianar97/Etube |

## Visual spec (extracted from annebrandes.com's compiled CSS)

- **Layout:** `main` is `max-w-[480px] mx-auto px-6 pt-20 sm:pt-[22vh] pb-32` inside a `min-h-screen` div.
- **Colors:** `--fg: #2c2c2c`, `--fg-2: #888`, `--fg-3: #aaa`, `--bg: #fff`, `--rule: #eee`. Selection background `#e0e0e0`. Dark mode is forced to the light palette (`prefers-color-scheme: dark` re-declares the same values).
- **Typography:** root `font-size: 14px`; body letter-spacing `-0.008em`; `font-feature-settings: "kern" 1, "liga" 1`; antialiased. Name: 16px, `tracking -0.02em`, `leading 1`. Body: 14px, `leading 1.75`. Mono labels: 10px, uppercase, `tracking 0.04em`, weight 500. Arrow: 12px.
- **Fonts:** Inter (sans, weights 400/500) and Geist Mono (mono, weight 500) via `next/font/google` — substitutes for the original's commercial Neue Haas Unica / GT Standard Mono, which cannot be legally copied.
- **Bio links (`.bio-link`):** underline with `text-decoration-color: #ddd`, `text-underline-offset: 2.5px`, transition to `--fg` on hover (0.15s ease).
- **Social icons (`.social-icon`):** 16px, color `--fg-3`, hover → `--fg` (0.15s ease).
- **Work rows (`.work-row`):** flex row, `py-3`, title (14px) + date (mono label) left; source (mono label) + `→` arrow right. Hover: row opacity 0.6, arrow `translateX(2px)` (0.15s ease).
- **Entrance animation:** `@keyframes enter` — from `opacity 0 / translateY(4px)` to visible; `.anim { animation: enter .4s ease-out both }` with delays `.d1 0s`, `.d2 .05s`, `.d3 .12s`. Header = d1, bio = d2, work list = d3.
- **Spacing:** header block `mb-12` (name row `mb-2`), bio `space-y-5 mb-16`.

## Architecture

- **Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, `react-icons` (`FaGithub` and `FaLinkedin` from `react-icons/fa`, `FaXTwitter` from `react-icons/fa6` — these match the original site's exact SVG paths).
- **Rendering:** fully static (`output: 'export'` in `next.config.ts`). No server code, no API routes, no analytics, no CMS.
- **Files:**
  - `app/layout.tsx` — font setup, metadata (title, description, Open Graph, Twitter card), html/body shell
  - `app/globals.css` — Tailwind import, CSS variables, custom classes (`.bio-link`, `.social-icon`, `.work-row`, `.work-arrow`, `.mono`, `.anim`/`.d1–.d3`), keyframes
  - `app/page.tsx` — the page: header, bio, work list, rendered from content data
  - `lib/content.ts` — typed content: name, email text, social links, bio paragraphs (text segments + links), work items
- **Bio data shape:** paragraphs are arrays of segments (`string | { text, href }`) so links render as `.bio-link` anchors without hardcoding content in JSX.

## Error handling

Static site — no runtime inputs. Next.js default 404 page suffices. External links use `target="_blank" rel="noopener noreferrer"`.

## Validation

1. `npm run build` passes (static export).
2. `npm run lint` passes.
3. Visual check in browser at 480px+ and mobile widths against annebrandes.com side by side: layout, colors, type sizes, hover states, entrance animation.

## Out of scope

Blog, dark mode toggle, analytics, CMS, i18n, tests beyond build/lint (YAGNI for a static one-pager).
