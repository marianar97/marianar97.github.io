import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { books, notes, type DocumentEntry } from '@/lib/thinking-space';
import { renderMarkdown } from '@/lib/thinking-space-markdown';
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
  const entries: DocumentEntry[] = await Promise.all(sources.map(async source => ({
    ...source,
    html: renderMarkdown(await readFile(path.join(process.cwd(), 'content/thinking-space', `${source.id}.md`), 'utf8')),
  })));
  return <ThinkingSpace entries={entries} />;
}
