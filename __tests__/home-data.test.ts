import { getHomeData } from '../lib/home-data';

describe('getHomeData utility', () => {
  test('returns hero configuration and features', () => {
    const data = getHomeData();
    expect(data.hero.title).toBe('Gearizen');
    expect(Array.isArray(data.features)).toBe(true);
    expect(data.features.length).toBeGreaterThan(0);
    for (const feat of data.features) {
      expect(feat).toHaveProperty('href');
      expect(feat).toHaveProperty('icon');
    }
  });
});
