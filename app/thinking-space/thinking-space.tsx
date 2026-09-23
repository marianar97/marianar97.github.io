'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { site } from '@/lib/content';
import { books, type DocumentEntry, type LinkItem } from '@/lib/thinking-space';
import Book, { bookStyle } from './book';
import BookPreview from './book-preview';
import DocumentProperties from './document-properties';
import MarkdownContent from './markdown-content';
import bookEffects from './book.module.css';

// Edit this one Tailwind class to change the width of all book annotations.
// Examples: 'max-w-[680px]', 'max-w-[960px]', or 'max-w-none'.
const ANNOTATION_WIDTH = 'max-w-[900px]';

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
const getHash = () => window.location.hash.slice(1) || 'shelf';
const serverHash = () => 'shelf';

export default function ThinkingSpace({ entries, links }: { entries: DocumentEntry[]; links: LinkItem[] }) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, serverHash);
  const [kind, id] = hash.split('/');
  const [query, setQuery] = useState('');
  const article = useRef<HTMLElement>(null);
  const selected = entries.find(entry => entry.type === kind && entry.id === id);
  const book = kind === 'book' ? books.find(book => book.id === id) : undefined;
  const section = kind === 'links' ? 'links' : ['notes', 'note'].includes(kind) ? 'notes' : 'shelf';
  const showReader = ['book', 'note', 'notes', 'books'].includes(kind);
  const catalogType = ['book', 'books'].includes(kind) ? 'book' : 'note';
  const catalog = entries.filter(entry => entry.type === catalogType && `${entry.title} ${entry.subtitle}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (selected) article.current?.focus({ preventScroll: true });
  }, [selected]);

  return <div className="thinking-space grid grid-cols-[220px_minmax(0,1fr)] items-start gap-[48px] text-(--fg) max-[1100px]:grid-cols-[185px_minmax(0,1fr)] max-[1100px]:gap-[30px] max-[850px]:grid-cols-[155px_minmax(0,1fr)] max-[850px]:gap-[24px] max-[600px]:block [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-[5px] [&_a:focus-visible]:outline-(--fg) [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-offset-[5px] [&_input:focus-visible]:outline-(--fg)">
    <aside aria-label="Site navigation" className="sticky top-[40px] max-[600px]:static">
      <header className="mb-[52px] max-[600px]:mb-0">
        <Link href="/" className="text-[18px] leading-[1.2] tracking-[-.02em] max-[850px]:text-[17px] max-[600px]:text-[20px]">{site.name}</Link>
      </header>
      <nav className="flex flex-col items-start gap-[19px] pt-[5px] max-[600px]:flex-row max-[600px]:gap-6 max-[600px]:pt-[24px] max-[600px]:pb-[29px]" aria-label="Thinking space">
        {(['shelf', 'notes', 'links'] as const).map(key => <a key={key} href={`#${key}`} aria-current={section === key ? 'page' : undefined} onClick={() => setQuery('')}
          className="text-[16px] leading-normal text-(--fg-2) transition-colors duration-150 hover:text-(--fg) aria-[current=page]:text-(--fg) max-[600px]:text-[15px]">
          {{ shelf: 'Bookshelf', notes: 'Notes', links: 'Links' }[key]}
        </a>)}
      </nav>
    </aside>
    <div className="min-w-0 pt-17 max-[600px]:pt-0">

      {/* bookshelf section */}
      {!showReader && section === 'shelf' && <section className="grid grid-cols-[repeat(auto-fit,minmax(125px,1fr))] items-start gap-x-[32px] gap-y-[44px] px-[4px] max-[1100px]:grid-cols-4 max-[1100px]:gap-x-6 max-[1100px]:gap-y-[42px] max-[850px]:grid-cols-3 max-[850px]:gap-x-[24px] max-[850px]:gap-y-10 max-[600px]:grid-cols-2 max-[600px]:gap-y-8 max-[600px]:px-[6px]" aria-label="Bookshelf">
        {books.map(book => <a className={`${bookEffects.shelfLink} group relative w-full max-w-[190px] justify-self-center`} key={book.id} href={`#book/${book.id}`} aria-label={`Read notes: ${book.title}`} title={`${book.title} — ${book.author}`}>
          <span className={`${bookEffects.object} relative flex h-[226px] items-center justify-center min-[1350px]:h-[247px] max-[600px]:h-[219px]`} aria-hidden="true">
            <span className={`${bookEffects.volume} ${bookEffects.shelfVolume}`} style={bookStyle(book)}><Book book={book} /></span>
          </span>
          <span className="pointer-events-none absolute top-full -right-[12px] -left-[12px] -translate-y-[3px] py-[10px] text-center text-[12px] leading-[1.6] opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none max-[600px]:text-[11px]">
            {book.title}<br /><small className="text-[11px] text-(--fg-2)">{book.author}</small>
          </span>
        </a>)}
      </section>
      }

      {/* book section */}
      {book && selected && <section className="min-w-0" aria-label="Book and reading notes">
        <article ref={article} tabIndex={-1} className="focus:outline-none" aria-label="Selected document">
          <div className="grid grid-cols-[250px_minmax(0,1fr)] items-start gap-[42px] max-[1100px]:grid-cols-[210px_minmax(0,1fr)] max-[1100px]:gap-[28px] max-[850px]:grid-cols-[170px_minmax(0,1fr)] max-[850px]:gap-[24px] max-[600px]:block">
            <BookPreview key={book.id} book={book} />
            <div className="min-w-0 pt-[14px] max-[600px]:pt-[22px]">
              <h1 className="mb-[14px] text-[27px] leading-tight font-semibold tracking-tight max-[850px]:text-[23px]">{selected.title}</h1>
              {selected.subtitle && <p className="mb-[32px] max-w-[470px] text-[14px] leading-[1.7] text-(--fg-2)">{selected.subtitle}</p>}
              <DocumentProperties properties={selected.properties.some(property => property.name === 'author') ? selected.properties : [{ name: 'author', value: book.author }, ...selected.properties]} />
            </div>
          </div>
          <div data-book-annotations className={`${ANNOTATION_WIDTH} mt-8 w-full border-t border-[#eee] pt-[38px] pb-[60px] max-[600px]:mt-[28px] max-[600px]:pt-[28px]`}>
            <MarkdownContent html={selected.html} />
          </div>
        </article>
      </section>}

      {/* notes section */}
      {showReader && !book && <section className="grid min-h-[65vh] min-w-0 grid-cols-[220px_minmax(0,1fr)] max-[1100px]:grid-cols-[175px_minmax(0,1fr)] max-[850px]:grid-cols-[155px_minmax(0,1fr)] max-[600px]:block max-[600px]:min-h-0" aria-label="Notes reader">
        <aside className={`border-r border-[#eee] pr-[26px] pb-[20px] max-[850px]:pr-4 max-[600px]:border-0 max-[600px]:p-0 ${selected ? 'max-[600px]:hidden' : ''}`}>
          <label className="sr-only" htmlFor="note-search">Search titles and topics</label>
          <input className="mb-[15px] w-full rounded-none border-0 border-b border-[#eee] bg-transparent pt-[8px] pb-[12px] text-[14px] placeholder:text-(--fg-2)" id="note-search" type="search" placeholder={catalogType === 'book' ? 'Find a book…' : 'Find a note…'} value={query} onChange={e => setQuery(e.target.value)} />
          <nav aria-label="Documents">{catalog.map(entry => <a key={entry.id} className="block border-l-2 border-transparent py-[13px] pl-[12px] aria-[current=page]:border-(--fg)" href={`#${entry.type}/${entry.id}`} aria-current={selected?.id === entry.id ? 'page' : undefined}>
            <strong className="block text-[15px] leading-[1.4] font-normal">{entry.title}</strong><small className="mt-[5px] block text-[12px] leading-normal text-(--fg-2)">{entry.subtitle}</small>
          </a>)}</nav>
          {!catalog.length && <p className="text-[15px] leading-[1.7] text-(--fg-2)">No matching notes.</p>}
        </aside>
        <div className={`min-w-0 pr-[20px] pb-[60px] pl-[42px] max-[1100px]:pl-[25px] max-[600px]:px-0 max-[600px]:pb-[40px] ${!selected ? 'max-[600px]:hidden' : ''}`}>
          <a className="hidden pb-[24px] text-[13px] text-(--fg-2) max-[600px]:block" href={catalogType === 'book' ? '#books' : '#notes'}>← All {catalogType === 'book' ? 'books' : 'notes'}</a>
          {selected ? <article ref={article} className="w-full max-w-[620px] focus:outline-none" tabIndex={-1} aria-label="Selected document"><DocumentProperties properties={selected.properties} /><MarkdownContent html={selected.html} noteIntro /></article> : <p role="status" className="text-[15px] leading-[1.7] text-(--fg-2)">{id ? 'This note could not be found. Choose one from the list.' : 'Select a note.'}</p>}
        </div>
      </section>}

      {/* links section */}
      {section === 'links' && <section className="max-w-[680px]" aria-label="Saved links">
        {links.map(link => <a key={link.href} className="flex items-center justify-between gap-[20px] border-b border-[#eee] py-[21px] transition-opacity duration-150 first:pt-[5px] hover:opacity-60" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.title} — opens in a new tab`}>
          <span><strong className="mb-[5px] block text-[16px] leading-normal font-normal">{link.title}</strong><small className="text-[12px] text-(--fg-2)">{new URL(link.href).hostname}</small></span><span aria-hidden="true">↗</span>
        </a>)}
      </section>}
    </div>
  </div>;
}
