import sections from './privacy-sections.json';

export interface PrivacySection {
  id: string;
  title: string;
  body: string;
}

/** Returns structured privacy policy sections loaded from JSON. */
export function getPrivacySections(): PrivacySection[] {
  return sections as PrivacySection[];
}
