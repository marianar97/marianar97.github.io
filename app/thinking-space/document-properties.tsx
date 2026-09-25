import type { DocumentProperty, PropertyScalar } from '@/lib/thinking-space';

function Value({ value, label }: { value: PropertyScalar; label: string }) {
  if (typeof value === 'boolean') return <input className="h-[15px] w-[15px] align-middle accent-[var(--fg)]" type="checkbox" checked={value} disabled aria-label={label} />;
  if (typeof value === 'string' && /^https:\/\/\S+$/.test(value)) {
    return <a className="underline decoration-[#eee] underline-offset-[3px]" href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isNaN(date.valueOf())) return <time dateTime={value}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time>;
  }
  return <>{String(value)}</>;
}

export default function DocumentProperties({ properties }: { properties: DocumentProperty[] }) {
  if (!properties.length) return null;
  return <dl className="mt-[28px] text-[14px] leading-[1.6]" aria-label="Document properties">
    {properties.map(({ name, value }) => {
      const label = name.replace(/[_-]/g, ' ');
      return <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-[16px] py-[10px] max-[850px]:grid-cols-1 max-[850px]:gap-[4px] max-[600px]:grid-cols-[76px_minmax(0,1fr)] max-[600px]:gap-[16px]" key={name}>
        <dt className="text-[var(--fg-2)] capitalize">{label}</dt>
        <dd className="m-0 min-w-0 [overflow-wrap:anywhere]">{Array.isArray(value) ? <span className="flex flex-wrap gap-[6px]">{value.map((item, i) =>
          <span className="rounded-[4px] bg-[#f5f5f4] px-[9px] py-[3px] text-[12px] leading-[1.6] text-[#666]" key={i}><Value value={item} label={label} /></span>
        )}</span> : <Value value={value} label={label} />}</dd>
      </div>;
    })}
  </dl>;
}
