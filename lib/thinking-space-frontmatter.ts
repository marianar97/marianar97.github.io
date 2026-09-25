import { parse } from 'yaml';
import type { DocumentProperty, PropertyScalar } from './thinking-space';

const isScalar = (value: unknown): value is PropertyScalar =>
  typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value));

// Parse on the server; only simple serializable properties reach the reader.
export function parseFrontmatter(source: string) {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { body: normalized, properties: [] as DocumentProperty[] };
  const match = normalized.match(/^---\n([\s\S]*?)^---[ \t]*(?:\n|$)/m);
  if (!match) throw new Error('YAML properties need a closing --- line.');
  const data: unknown = parse(match[1], { maxAliasCount: 0 });
  if (data !== null && (typeof data !== 'object' || Array.isArray(data))) {
    throw new Error('YAML properties must be a mapping of names to values.');
  }
  const properties: DocumentProperty[] = [];
  for (const [name, value] of Object.entries(data ?? {})) {
    if (value === null) continue;
    if (!isScalar(value) && !(Array.isArray(value) && value.every(isScalar))) {
      throw new Error(`Property "${name}" must be text, a number, a boolean, or a list of these values.`);
    }
    if (['title', 'subtitle'].includes(name) && typeof value !== 'string') {
      throw new Error(`Property "${name}" must be text.`);
    }
    properties.push({ name, value });
  }
  return { body: normalized.slice(match[0].length).trimStart(), properties };
}
