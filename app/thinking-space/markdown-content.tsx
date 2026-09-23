// Shared reading typography. Layout and width belong to the surrounding view.
export default function MarkdownContent({ html, noteIntro = false }: { html: string; noteIntro?: boolean }) {
  return <div
    className={`w-full text-[18px] leading-[1.75]
      [&_h1]:mb-[16px] [&_h1]:text-[24px] [&_h1]:leading-[1.3] [&_h1]:font-semibold [&_h1]:tracking-[-.02em]
      [&_h2]:mt-[30px] [&_h2]:mb-[14px] [&_h2]:text-[20px] [&_h2]:leading-[1.5] [&_h2]:font-medium
      [&_:is(h3,h4,h5,h6)]:mt-[28px] [&_:is(h3,h4,h5,h6)]:mb-[10px] [&_:is(h3,h4,h5,h6)]:text-[18px] [&_:is(h3,h4,h5,h6)]:leading-[1.5] [&_:is(h3,h4,h5,h6)]:font-medium
      [&_p]:mb-[18px] [&_blockquote]:my-[28px] [&_blockquote]:border-l-2 [&_blockquote]:border-[#ddd] [&_blockquote]:py-[3px] [&_blockquote]:pl-[20px] [&_blockquote_p]:m-0
      [&_a]:underline [&_a]:decoration-[#ddd] [&_a]:underline-offset-[2.5px] [&_a:hover]:decoration-[var(--fg)]
      [&_:is(ul,ol)]:mt-[16px] [&_:is(ul,ol)]:mb-[25px] [&_:is(ul,ol)]:pl-[22px] [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-[8px] [&_li]:pl-[5px]
      [&_hr]:my-[34px] [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#eee]
      [&_code]:bg-[#fafafa] [&_code]:px-[4px] [&_code]:py-[2px] [&_code]:font-mono [&_code]:text-[14px]
      [&>:first-child]:mt-0
      ${noteIntro ? '[&>p:first-of-type]:mb-[30px] [&>p:first-of-type]:text-[13px] [&>p:first-of-type]:leading-[1.6] [&>p:first-of-type]:text-[var(--fg-2)]' : ''}`}
    dangerouslySetInnerHTML={{ __html: html }}
  />;
}
