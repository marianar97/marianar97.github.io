import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Book as BookData } from '@/lib/thinking-space';
import styles from './thinking-space.module.css';

export function bookStyle(book: BookData): CSSProperties {
  return { '--color': book.color, '--foil': book.foil, '--lean': `${book.lean}deg` } as CSSProperties;
}
export default function Book({ book }: { book: BookData }) {
  return <>
    <span className={`${styles.face} ${styles.front}`}>
      <Image src={`/thinking-space/covers/${book.id}.svg`} alt="" width={600} height={900} unoptimized draggable={false} className={styles.coverArt} />
      <span className={styles.groove} />
    </span>
    <span className={`${styles.face} ${styles.back}`}>
      <span className={styles.imprint}>Notes in the margins</span>
      <span className={styles.backThought}>{book.thought}</span>
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" dangerouslySetInnerHTML={{ __html: book.motif }} />
      <span className={styles.imprint}>The reading room · 0{book.number}</span>
    </span>
    <span className={`${styles.face} ${styles.spine}`}><span>{book.title}</span><small>0{book.number}</small></span>
    <span className={`${styles.face} ${styles.pages}`} />
    <span className={`${styles.face} ${styles.top}`} />
    <span className={`${styles.face} ${styles.bottom}`} />
  </>;
}
