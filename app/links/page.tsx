import { loadThinkingSpaceContent } from "@/lib/thinking-space-content";

export default async function Links() {
  const { links } = await loadThinkingSpaceContent();
  return (
    <>
      <h1 className="anim d1 text-[24px] font-semibold tracking-[-0.02em] leading-none mb-10">
        Links I like
      </h1>
      <section className="anim d2">
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-row flex items-baseline py-2 text-[16px] leading-none"
          >
            <span className="w-28 sm:w-35 shrink-0 leading-none" style={{ color: "var(--fg-2)" }}>
              {item.date}
            </span>
            <span>{item.title}</span>
          </a>
        ))}
      </section>
    </>
  );
}
