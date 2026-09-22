'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { site, links } from '@/lib/content';
import { books, type DocumentEntry } from '@/lib/thinking-space';
import Book, { bookStyle } from './book';
import BookPreview from './book-preview';
import styles from './thinking-space.module.css';

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}
const getHash = () => window.location.hash.slice(1) || 'shelf';
const serverHash = () => 'shelf';

export default function ThinkingSpace({ entries }: { entries: DocumentEntry[] }) {
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

  return <div className={`thinking-space ${styles.space}`}>
    <header className={styles.header}><Link href="/" className={styles.identity}>{site.name}</Link></header>
    <div className={styles.layout}>
      <nav className={styles.nav} aria-label="Thinking space">
        {(['shelf', 'notes', 'links'] as const).map(key => <a key={key} href={`#${key}`} aria-current={section === key ? 'page' : undefined} onClick={() => setQuery('')}>
          {{ shelf: 'Bookshelf', notes: 'Notes', links: 'Links' }[key]}
        </a>)}
      </nav>
      {!showReader && section === 'shelf' && <section className={styles.collection} aria-label="Bookshelf">
        {books.map(book => <a className={styles.item} key={book.id} href={`#book/${book.id}`} aria-label={`Read notes: ${book.title}`} title={`${book.title} — ${book.author}`}>
          <span className={styles.object} aria-hidden="true"><span className={`${styles.volume} ${styles.shelfVolume}`} style={bookStyle(book)}><Book book={book} /></span></span>
          <span className={styles.caption}>{book.title}<br /><small>{book.author}</small></span>
        </a>)}
      </section>}
      {showReader && <section className={`${styles.reader} ${book ? styles.bookReader : ''} ${selected ? styles.selected : ''}`} aria-label="Notes reader">
        {book ? <BookPreview key={book.id} book={book} /> : <aside className={styles.catalog}>
          <label className={styles.srOnly} htmlFor="note-search">Search titles and topics</label>
          <input className={styles.search} id="note-search" type="search" placeholder={catalogType === 'book' ? 'Find a book…' : 'Find a note…'} value={query} onChange={e => setQuery(e.target.value)} />
          <nav aria-label="Documents">{catalog.map(entry => <a key={entry.id} className={styles.catalogItem} href={`#${entry.type}/${entry.id}`} aria-current={selected?.id === entry.id ? 'page' : undefined}>
            <strong>{entry.title}</strong><small>{entry.subtitle}</small>
          </a>)}</nav>
          {!catalog.length && <p className={styles.status}>No matching notes.</p>}
        </aside>}
        <div className={styles.document}>
          {!book && <a className={styles.backList} href={catalogType === 'book' ? '#books' : '#notes'}>← All {catalogType === 'book' ? 'books' : 'notes'}</a>}
          {selected ? <article ref={article} className={styles.markdown} tabIndex={-1} aria-label="Selected document" dangerouslySetInnerHTML={{ __html: selected.html }} /> : <p role="status" className={styles.status}>{id ? 'This note could not be found. Choose one from the list.' : 'Select a note.'}</p>}
        </div>
      </section>}
      {section === 'links' && <section className={styles.links} aria-label="Saved links">
        {links.map(link => <a key={link.href} className={styles.savedLink} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.title} — opens in a new tab`}>
          <span><strong>{link.title}</strong><small>{new URL(link.href).hostname}</small></span><span aria-hidden="true">↗</span>
        </a>)}
      </section>}
    </div>
  </div>;
}
