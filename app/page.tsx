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
    <div className="min-h-screen">
      <main className="w-[30%]  mx-auto px-6 pt-20 sm:pt-[22vh] pb-32">
 
        <div className="anim d1 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[22px] tracking-[-0.02em] leading-[1]">
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
                    <Icon size={20} />
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
        {/* <section className="anim d3">
          {work.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="work-row group flex items-center justify-between py-3"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-[18px]">{item.title}</span>
                <span
                  className="mono text-[13px] tracking-[0.04em] uppercase"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.date}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <span
                  className="mono text-[13px] tracking-[0.04em] uppercase"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.source}
                </span>
                <span className="work-arrow text-[17px]" style={{ color: "var(--fg-3)" }}>
                  →
                </span>
              </span>
            </a>
          ))}
        </section> */}
      </main>
    </div>
  );
}
