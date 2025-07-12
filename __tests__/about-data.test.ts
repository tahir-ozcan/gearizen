import { loadAboutData } from '../lib/aboutData';

describe('loadAboutData', () => {
  test('loads JSON blocks', async () => {
    const data = await loadAboutData();
    expect(Array.isArray(data.blocks)).toBe(true);
    expect(data.blocks[0]).toHaveProperty('type');
  });

  test('contains Why Choose bullets', async () => {
    const data = await loadAboutData();
    const bullets = data.blocks.find(b => b.type === 'bullets');
    expect(bullets && 'items' in bullets && bullets.items.length).toBeGreaterThan(0);
  });
});
