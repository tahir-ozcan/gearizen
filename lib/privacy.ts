import sections from '../docs/privacy-policy.json';
import { slugify } from './slugify';

export interface PrivacySection {
  title: string;
  markdown: string;
  id: string;
}

/**
 * Returns privacy policy sections with generated IDs for anchor links.
 */
export function getPrivacySections(): PrivacySection[] {
  return (sections as { title: string; markdown: string }[]).map((s) => ({
    ...s,
    id: slugify(s.title, { removeStopWords: true }),
  }));
}
