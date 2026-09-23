import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFrontmatter } from '../lib/thinking-space-frontmatter.ts';
import { renderMarkdown } from '../lib/thinking-space-markdown.ts';

test('reads Obsidian-style scalar and list properties without changing the writing', () => {
  const body = 'A paragraph.\n\n---\n\n#### A small heading\n';
  const result = parseFrontmatter(`---\ntitle: "A title: with punctuation"\ngenres:\n  - Biography\n  - Artificial Intelligence\nfavorite: false\nrating: 4.5\nfinished: 2026-09-22\nsummary: >\n  Multiple lines\n  of text.\n---\n\n${body}`);
  assert.equal(result.body, body);
  assert.deepEqual(result.properties.slice(1, 5), [
    { name: 'genres', value: ['Biography', 'Artificial Intelligence'] },
    { name: 'favorite', value: false },
    { name: 'rating', value: 4.5 },
    { name: 'finished', value: '2026-09-22' },
  ]);
  assert.equal(result.properties[5].value, 'Multiple lines of text.\n');
});

test('preserves documents without YAML and accepts empty or Windows-style YAML', () => {
  assert.deepEqual(parseFrontmatter('# My note\n\n---\nText'), { body: '# My note\n\n---\nText', properties: [] });
  assert.deepEqual(parseFrontmatter('---\n---\nBody'), { body: 'Body', properties: [] });
  assert.deepEqual(parseFrontmatter('\uFEFF---\r\nauthor: Me\r\n---\r\nBody'), { body: 'Body', properties: [{ name: 'author', value: 'Me' }] });
});

test('reports malformed, duplicate, nested, and incorrectly typed properties', () => {
  for (const yaml of ['title: [broken', 'title: First\ntitle: Second', 'nested:\n  title: Test', 'title: [One, Two]']) {
    assert.throws(() => parseFrontmatter(`---\n${yaml}\n---\nBody`));
  }
  assert.throws(() => parseFrontmatter('---\ntitle: Missing delimiter'), /closing/);
});

test('keeps HTML escaped and renders the fourth-level headings used in book notes', () => {
  const { body } = parseFrontmatter('---\nauthor: Test\n---\n#### Business\n\n<script>alert(1)</script>');
  assert.equal(renderMarkdown(body), '<h4>Business</h4><p>&lt;script&gt;alert(1)&lt;/script&gt;</p>');
});
