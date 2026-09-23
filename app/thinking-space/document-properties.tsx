import type { DocumentProperty, PropertyScalar } from '@/lib/thinking-space';
import styles from './thinking-space.module.css';

function Value({ value, label }: { value: PropertyScalar; label: string }) {
  if (typeof value === 'boolean') return <input type="checkbox" checked={value} disabled aria-label={label} />;
  if (typeof value === 'string' && /^https:\/\/\S+$/.test(value)) {
    return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isNaN(date.valueOf())) return <time dateTime={value}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time>;
  }
  return <>{String(value)}</>;
}

export default function DocumentProperties({ properties }: { properties: DocumentProperty[] }) {
  if (!properties.length) return null;
  return <dl className={styles.properties} aria-label="Document properties">
    {properties.map(({ name, value }) => {
      const label = name.replace(/[_-]/g, ' ');
      return <div className={styles.property} key={name}>
        <dt>{label}</dt>
        <dd>{Array.isArray(value) ? <span className={styles.propertyTags}>{value.map((item, i) =>
          <span className={styles.propertyTag} key={i}><Value value={item} label={label} /></span>
        )}</span> : <Value value={value} label={label} />}</dd>
      </div>;
    })}
  </dl>;
}
