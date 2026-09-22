// The local notes use headings, paragraphs, lists, quotes and inline links.
// Escape all source HTML; only HTTPS and internal document links are accepted.
function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]!);
}
function inline(value: string) {
  return escapeHTML(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
      if (!/^(#[a-z0-9/-]+|https:\/\/[^\s]+)$/i.test(href)) return label;
      return `<a href="${href}"${href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
export function renderMarkdown(source: string) {
  const out: string[] = [];
  let paragraph: string[] = [], list: 'ul' | 'ol' | null = null;
  const flush = () => {
    if (paragraph.length) { out.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; }
    if (list) { out.push(`</${list}>`); list = null; }
  };
  for (const line of source.split('\n')) {
    const heading = line.match(/^(#{1,3}) (.+)$/);
    const item = line.match(/^(- |\d+\. )(.+)$/);
    if (!line.trim()) flush();
    else if (heading) { flush(); out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); }
    else if (/^---+$/.test(line)) { flush(); out.push('<hr>'); }
    else if (line.startsWith('> ')) { flush(); out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); }
    else if (item) {
      if (paragraph.length) flush();
      const kind = item[1] === '- ' ? 'ul' : 'ol';
      if (list !== kind) { if (list) out.push(`</${list}>`); list = kind; out.push(`<${kind}>`); }
      out.push(`<li>${inline(item[2])}</li>`);
    } else { if (list) flush(); paragraph.push(line); }
  }
  flush();
  return out.join('');
}
