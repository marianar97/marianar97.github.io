import type { Metadata } from 'next';
import { loadThinkingSpaceContent } from '@/lib/thinking-space-content';
import ThinkingSpace from './thinking-space';

export const metadata: Metadata = {
  title: 'Thinking space · Mariana Ramirez Duque',
  description: 'Books, notes, and links worth returning to.',
};

export default async function ThinkingSpacePage() {
  const { entries, links } = await loadThinkingSpaceContent();
  return <ThinkingSpace entries={entries} links={links} />;
}
