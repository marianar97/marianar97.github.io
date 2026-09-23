import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { books, notes, type DocumentEntry } from '@/lib/thinking-space';
import { renderMarkdown } from '@/lib/thinking-space-markdown';
import { parseFrontmatter } from '@/lib/thinking-space-frontmatter';
import ThinkingSpace from './thinking-space';

export const metadata: Metadata = {
  title: 'Thinking space · Mariana Ramirez Duque',
  description: 'Books, notes, and links worth returning to.',
};

export default async function ThinkingSpacePage() {
  const sources = [
    ...books.map(book => ({ id: book.id, type: 'book' as const, title: book.title, subtitle: book.author })),
    ...notes.map(note => ({ ...note, type: 'note' as const })),
  ];
  const entries: DocumentEntry[] = await Promise.all(sources.map(async source => {
    const file = `${source.id}.md`;
    try {
      const { body, properties } = parseFrontmatter(await readFile(path.join(process.cwd(), 'content/thinking-space', file), 'utf8'));
      const title = properties.find(property => property.name === 'title')?.value;
      const subtitle = properties.find(property => property.name === 'subtitle')?.value;
      return {
        ...source,
        title: typeof title === 'string' ? title : source.title,
        subtitle: typeof subtitle === 'string' ? subtitle : source.type === 'book' ? '' : source.subtitle,
        properties: properties.filter(property => !['title', 'subtitle'].includes(property.name)),
        html: renderMarkdown(body),
      };
    } catch (error) {
      throw new Error(`Could not read ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
  return <ThinkingSpace entries={entries} />;
}
