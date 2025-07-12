import { getPrivacyPolicySections } from '../lib/privacyPolicy';
import { renderMarkdown } from '../lib/render-markdown';

describe('privacy policy utilities', () => {
  test('parses json into sections', () => {
    const sections = getPrivacyPolicySections();
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((s) => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.title).toBe('string');
      expect(typeof s.content).toBe('string');
    });
  });

  test('renders markdown to html', () => {
    const [first] = getPrivacyPolicySections();
    const html = renderMarkdown(first.content);
    expect(html).toContain('<');
  });
});
