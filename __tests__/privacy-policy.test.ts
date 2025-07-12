import { getPrivacySections } from '../lib/privacy';

describe('getPrivacySections', () => {
  test('generates ids for each section', () => {
    const sections = getPrivacySections();
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((s) => {
      expect(s.id).toMatch(/^[a-z0-9-]+$/);
    });
  });
});
