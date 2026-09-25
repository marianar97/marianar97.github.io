import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { books, type DocumentEntry, type DocumentProperty, type LinkItem } from './thinking-space';
import { parseFrontmatter } from './thinking-space-frontmatter';
import { renderMarkdown } from './thinking-space-markdown';

const contentRoot = path.join(process.cwd(), 'content/thinking-space');

function textProperty(properties: DocumentProperty[], name: string) {
  const value = properties.find(property => property.name === name)?.value;
  return typeof value === 'string' ? value : undefined;
}

function withoutHeader(properties: DocumentProperty[]) {
  return properties.filter(property => !['title', 'subtitle'].includes(property.name));
}

function requireText(properties: DocumentProperty[], name: string, file: string) {
  const value = textProperty(properties, name);
  if (value) return value;
  throw new Error(`${file} needs a ${name}.`);
}

async function readDocument(folder: string, id: string) {
  const file = `${folder}/${id}.md`;
  try {
    return parseFrontmatter(await readFile(path.join(contentRoot, file), 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function markdownIds(folder: string) {
  const names = await readdir(path.join(contentRoot, folder));
  return names.filter(name => name.endsWith('.md')).map(name => name.slice(0, -'.md'.length));
}

async function loadNotes(): Promise<DocumentEntry[]> {
  const ids = await markdownIds('notes');
  const notes = await Promise.all(ids.map(async id => {
    const { body, properties } = await readDocument('notes', id);
    return {
      id,
      type: 'note' as const,
      title: textProperty(properties, 'title') ?? id,
      subtitle: textProperty(properties, 'subtitle') ?? '',
      properties: withoutHeader(properties),
      html: renderMarkdown(body),
    };
  }));
  return notes.sort((left, right) => left.title.localeCompare(right.title));
}

async function loadBooks(): Promise<DocumentEntry[]> {
  return Promise.all(books.map(async book => {
    const { body, properties } = await readDocument('books', book.id);
    return {
      id: book.id,
      type: 'book' as const,
      title: textProperty(properties, 'title') ?? book.title,
      subtitle: textProperty(properties, 'subtitle') ?? '',
      properties: withoutHeader(properties),
      html: renderMarkdown(body),
    };
  }));
}

async function loadLinks(): Promise<LinkItem[]> {
  const ids = await markdownIds('links');
  const links = await Promise.all(ids.map(async id => {
    const file = `links/${id}.md`;
    const { properties } = await readDocument('links', id);
    return {
      title: requireText(properties, 'title', file),
      date: requireText(properties, 'date', file),
      href: requireText(properties, 'href', file),
    };
  }));
  return links.sort((left, right) => left.title.localeCompare(right.title));
}

export async function loadThinkingSpaceContent() {
  const [bookEntries, noteEntries, links] = await Promise.all([loadBooks(), loadNotes(), loadLinks()]);
  return { entries: [...bookEntries, ...noteEntries], links };
}
