import { getPrivacySections } from '../lib/privacy';
import { renderMarkdown } from '../lib/render-markdown';

describe('privacy policy data', () => {
  test('parses sections from JSON', () => {
    const sections = getPrivacySections();
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
    for (const sec of sections) {
      expect(typeof sec.id).toBe('string');
      expect(typeof sec.title).toBe('string');
      expect(typeof sec.body).toBe('string');
    }
  });

  test('renders markdown to html', () => {
    const section = getPrivacySections()[0];
    const html = renderMarkdown(section.body);
    expect(html).toMatch(/<p|<ul/);
  });
});
