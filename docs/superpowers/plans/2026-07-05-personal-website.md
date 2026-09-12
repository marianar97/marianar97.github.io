# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Mariana Ramirez's personal website — a pixel-faithful replica of annebrandes.com's design with her content — as a statically exported Next.js 15 app.

**Architecture:** A single static page. All personal data lives in one typed module (`lib/content.ts`); `app/page.tsx` renders it; `app/globals.css` carries the exact visual values extracted from annebrandes.com's compiled CSS; `app/layout.tsx` wires fonts and metadata. No server code.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, `react-icons`, Inter + Geist Mono via `next/font/google`, static export (`output: "export"`).

**Spec:** `docs/superpowers/specs/2026-07-05-personal-website-design.md`

## Global Constraints

- Next.js 15+, React 19, Tailwind CSS v4, TypeScript (strict, from scaffold defaults).
- Static export: `output: "export"` in `next.config.ts`; build must produce `out/`.
- Only one runtime dependency beyond the scaffold: `react-icons`.
- All content changes happen in `lib/content.ts` only — no text hardcoded in components.
- Visual values are exact (from spec): `--fg: #2c2c2c`, `--fg-2: #888`, `--fg-3: #aaa`, `--bg: #fff`, `--rule: #eee`; root font-size 14px; body letter-spacing -0.008em; selection `#e0e0e0`; dark mode forced to light palette.
- Per spec, no unit tests: validation is `npm run build`, `npm run lint`, and visual comparison against annebrandes.com.

---

### Task 1: Scaffold Next.js project with static export

**Files:**
- Create: entire Next.js scaffold at repo root (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/`, `public/`, `.gitignore`)
- Modify: `next.config.ts` (static export)
- Delete: scaffold demo SVGs in `public/`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a building Next.js app with Tailwind v4 and `react-icons` installed; import alias `@/*` → repo root. Later tasks create `lib/content.ts` and replace `app/globals.css`, `app/layout.tsx`, `app/page.tsx`.

- [ ] **Step 1: Scaffold in a temp dir and copy in (repo root is non-empty, so `create-next-app` can't run in place)**

```bash
cd /Users/mariana/Documents/experiments/personal_website
npx --yes create-next-app@latest /tmp/pw-scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
rsync -a --exclude='.git' --exclude='node_modules' /tmp/pw-scaffold/ .
rm -rf /tmp/pw-scaffold
npm install
```

(If a scratchpad directory is available, use it instead of `/tmp` for `pw-scaffold`.)

- [ ] **Step 2: Configure static export — replace `next.config.ts` with:**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 3: Install react-icons and remove scaffold demo assets**

```bash
npm install react-icons
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

Keep `app/favicon.ico`.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build succeeds; `out/index.html` exists (`ls out/index.html`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 app with Tailwind v4 and static export"
```

---

### Task 2: Content data module

**Files:**
- Create: `lib/content.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (exact exports later tasks import via `@/lib/content`):
  - `type BioSegment = string | { text: string; href: string }`
  - `type SocialLabel = "GitHub" | "LinkedIn" | "X"`
  - `interface Social { label: SocialLabel; href: string }`
  - `interface WorkItem { title: string; date: string; source: string; href: string }`
  - `const site: { name: string; description: string; emailText: string; socials: Social[] }`
  - `const bio: BioSegment[][]`
  - `const work: WorkItem[]`

- [ ] **Step 1: Create `lib/content.ts` with exactly this content**

```ts
export type BioSegment = string | { text: string; href: string };

export type SocialLabel = "GitHub" | "LinkedIn" | "X";

export interface Social {
  label: SocialLabel;
  href: string;
}

export interface WorkItem {
  title: string;
  date: string;
  source: string;
  href: string;
}

export const site = {
  name: "Mariana Ramirez",
  description: "Founding engineer at Fulcrum.",
  emailText: "mariana.ramirezd97 [at] gmail [dot] com",
  socials: [
    { label: "GitHub", href: "https://github.com/marianar97" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marianaramirezd/" },
    { label: "X", href: "https://x.com/marianaramd" },
  ] satisfies Social[],
};

export const bio: BioSegment[][] = [
  [
    "I'm a founding engineer at ",
    { text: "Fulcrum", href: "https://www.withfulcrum.com" },
    ". We're building AI that automates manual workflows for insurance brokers, so teams can scale their accounts without scaling their headcount. If you're interested in joining the team, reach out to my email.",
  ],
  [
    "Previously, I worked at startups (YC) and big companies (",
    { text: "SoFi", href: "https://www.sofi.com" },
    "). I earned my master's at ",
    { text: "Carnegie Mellon", href: "https://www.cmu.edu" },
    ".",
  ],
  [
    "I'm from Medellín, Colombia, and I wrote my first program at 13 with Lego Mindstorms after watching The Social Network. Outside of work, you'll find me digging into open-source projects and going down rabbit holes in history and philosophy.",
  ],
];

export const work: WorkItem[] = [
  {
    title: "Digital Garden",
    date: "Aug 2025",
    source: "GitHub",
    href: "https://github.com/marianar97/digital-garden",
  },
  {
    title: "Etube",
    date: "May 2024",
    source: "GitHub",
    href: "https://github.com/marianar97/Etube",
  },
];
```

(Dates and source labels render uppercase via CSS `uppercase` class — store them in normal case.)

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add typed site content module"
```

---

### Task 3: Global styles, fonts, and metadata

**Files:**
- Modify: `app/globals.css` (replace entirely)
- Modify: `app/layout.tsx` (replace entirely)

**Interfaces:**
- Consumes: `site` from `@/lib/content` (Task 2).
- Produces: CSS custom properties (`--fg`, `--fg-2`, `--fg-3`, `--bg`, `--rule`), font variables (`--font-sans`, `--font-mono`), and classes `.mono`, `.bio-link`, `.social-icon`, `.work-row`, `.work-arrow`, `.anim`, `.d1`, `.d2`, `.d3` used by Task 4.

- [ ] **Step 1: Replace `app/globals.css` entirely with:**

```css
@import "tailwindcss";

:root {
  --fg: #2c2c2c;
  --fg-2: #888;
  --fg-3: #aaa;
  --bg: #fff;
  --rule: #eee;
}

html {
  font-size: 14px;
}

html,
body {
  font-family: var(--font-sans), ui-sans-serif, system-ui, -apple-system,
    sans-serif;
  font-weight: 400;
  letter-spacing: -0.008em;
  font-feature-settings: "kern" 1, "liga" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--fg);
  background: var(--bg);
}

/* The original site forces the light palette in dark mode. */
@media (prefers-color-scheme: dark) {
  :root {
    --fg: #2c2c2c;
    --bg: #fff;
  }
  body {
    background: var(--bg);
  }
}

::selection {
  background: #e0e0e0;
}

.mono {
  font-family: var(--font-mono), "SF Mono", Monaco, monospace;
  font-weight: 500;
}

a.bio-link {
  text-decoration: underline;
  text-decoration-color: #ddd;
  text-underline-offset: 2.5px;
  transition: text-decoration-color 0.15s ease;
}

a.bio-link:hover {
  text-decoration-color: var(--fg);
}

.social-icon {
  color: var(--fg-3);
  transition: color 0.15s ease;
}

.social-icon:hover {
  color: var(--fg);
}

.work-row {
  transition: opacity 0.15s ease;
}

.work-row:hover {
  opacity: 0.6;
}

.work-row:hover .work-arrow {
  transform: translateX(2px);
}

.work-arrow {
  transition: transform 0.15s ease;
}

@keyframes enter {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.anim {
  animation: enter 0.4s ease-out both;
}

.d1 {
  animation-delay: 0s;
}

.d2 {
  animation-delay: 0.05s;
}

.d3 {
  animation-delay: 0.12s;
}
```

- [ ] **Step 2: Replace `app/layout.tsx` entirely with:**

```tsx
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds. (`app/page.tsx` is still the scaffold demo page — that's fine; Task 4 replaces it.)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add global styles, fonts, and metadata matching reference design"
```

---

### Task 4: Page

**Files:**
- Modify: `app/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `site`, `bio`, `work`, `BioSegment`, `SocialLabel` from `@/lib/content` (Task 2); CSS classes from Task 3.
- Produces: the complete rendered page.

- [ ] **Step 1: Replace `app/page.tsx` entirely with:**

```tsx
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { bio, site, work, type BioSegment, type SocialLabel } from "@/lib/content";

const icons: Record<SocialLabel, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  X: FaXTwitter,
};

function Segment({ segment }: { segment: BioSegment }) {
  if (typeof segment === "string") {
    return <>{segment}</>;
  }
  return (
    <a href={segment.href} className="bio-link">
      {segment.text}
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[480px] mx-auto px-6 pt-20 sm:pt-[22vh] pb-32">
        <div className="anim d1 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[16px] tracking-[-0.02em] leading-[1]">
              {site.name}
            </h1>
            <div className="flex items-center gap-2">
              {site.socials.map(({ label, href }) => {
                const Icon = icons[label];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-icon"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
          <p className="text-[14px] leading-[1.75]" style={{ color: "var(--fg)" }}>
            {site.emailText}
          </p>
        </div>
        <div
          className="anim d2 space-y-5 text-[14px] leading-[1.75] mb-16"
          style={{ color: "var(--fg)" }}
        >
          {bio.map((paragraph, i) => (
            <p key={i}>
              {paragraph.map((segment, j) => (
                <Segment key={j} segment={segment} />
              ))}
            </p>
          ))}
        </div>
        <section className="anim d3">
          {work.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="work-row group flex items-center justify-between py-3"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-[14px]">{item.title}</span>
                <span
                  className="mono text-[10px] tracking-[0.04em] uppercase"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.date}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <span
                  className="mono text-[10px] tracking-[0.04em] uppercase"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.source}
                </span>
                <span className="work-arrow text-[12px]" style={{ color: "var(--fg-3)" }}>
                  →
                </span>
              </span>
            </a>
          ))}
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: both pass, no errors or warnings.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render personal site page from content module"
```

---

### Task 5: Visual verification against the reference

**Files:**
- Possibly modify: `app/globals.css`, `app/page.tsx` (only if discrepancies are found)

**Interfaces:**
- Consumes: the complete app (Tasks 1–4).
- Produces: verified, finished site.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (in background)
Expected: serves on `http://localhost:3000`.

- [ ] **Step 2: Compare against the reference in a browser**

Open `http://localhost:3000` and `https://annebrandes.com` side by side (browser tools or screenshots). Check each item:

- Column: max 480px, centered, top padding 22vh on desktop / 80px on mobile width (<640px)
- Name row: 16px name left, three 16px icons right (GitHub, LinkedIn, X order)
- Email line directly under name, 14px, `#2c2c2c`
- Bio: 3 paragraphs, 14px / 1.75 line-height, 1.25rem gap between paragraphs
- Bio links: light gray (#ddd) underline, darkens to `#2c2c2c` on hover
- Work rows: title + uppercase mono date left; uppercase mono source + `→` right; row dims to 60% opacity on hover and the arrow slides 2px right
- Entrance: header, bio, and work list fade in staggered (0s / 0.05s / 0.12s)
- Selection highlight is `#e0e0e0`; page stays light in dark mode
- No horizontal scroll at 375px width

- [ ] **Step 3: Fix any discrepancies found, re-check, and commit**

If changes were needed:

```bash
git add -A
git commit -m "fix: visual parity adjustments against reference design"
```

- [ ] **Step 4: Final validation**

Run: `npm run build && npm run lint`
Expected: both pass. Site is complete.
