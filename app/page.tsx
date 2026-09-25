import Link from "next/link";
import Portrait from "./portrait";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { bio, site, type BioSegment, type SocialLabel } from "@/lib/content";

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
    <div className="home-layout">
      <div className="home-copy">
        <div className="anim d1 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[22px] tracking-[-0.02em] leading-none">
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
                    <Icon size={20} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
          <p className="text-[18px] leading-[1.75]" style={{ color: "var(--fg)" }}>
            {site.emailText}
          </p>
        </div>
        <div
          className="anim d2 space-y-5 text-[18px] leading-[1.75] mb-16"
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
