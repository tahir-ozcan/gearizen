import { generatePalette } from '../lib/color-palette';

describe('generatePalette', () => {
  test('complementary palette', () => {
    expect(generatePalette('#ff0000', 'complementary')).toEqual(['#ff0000', '#00ffff']);
  });

  test('triadic palette', () => {
    expect(generatePalette('#ff0000', 'triadic')).toEqual(['#ff0000', '#00ff00', '#0000ff']);
  });

  test('analogous count', () => {
    expect(generatePalette('#ff0000', 'analogous', 5)).toHaveLength(5);
  });
});
