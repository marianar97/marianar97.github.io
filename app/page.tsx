import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Markdown from "react-markdown";
import Portrait from "./portrait";
import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { site, type SocialLabel } from "@/lib/content";

const icons: Record<SocialLabel, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  X: FaXTwitter,
  Email: FaEnvelope,
};

export default async function Home() {
  const bio = await readFile(
    path.join(process.cwd(), "content/bio.md"),
    "utf8",
  );

  return (
    <div className="home-layout">
      <div className="home-copy">
        <div className="anim d1 mb-12">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] tracking-[-0.02em] leading-none">
              {site.name}
            </h1>
            <div className="flex items-center gap-2">
              {site.socials.map(({ label, href }) => {
                const Icon = icons[label];
                const external = !href.startsWith("mailto:");
                return (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="social-icon"
                  >
                    <Icon size={20} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="anim d2 space-y-5 text-[18px] leading-[1.75] mb-16"
          style={{ color: "var(--fg)" }}
        >
          <Markdown
            components={{
              a: ({ href, children }) => (
                <a href={href} className="bio-link">
                  {children}
                </a>
              ),
            }}
          >
            {bio}
          </Markdown>
        </div>
        <nav className="anim d3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/thinking-space" className="nav-link text-[16px]">
            thinking space
            <span className="ml-1 text-[13px]" aria-hidden>
              ↗
            </span>
          </Link>
        </nav>
      </div>
      <Portrait />
    </div>
  );
}
