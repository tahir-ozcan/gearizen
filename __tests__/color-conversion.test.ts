import { convertColor } from '../lib/color-conversion';

describe('convertColor', () => {
  test('converts hex to rgb and hsl', () => {
    const result = convertColor('#ff0000');
    expect(result).toEqual({
      hex: '#ff0000',
      rgb: 'rgb(255, 0, 0)',
      hsl: 'hsl(0, 100%, 50%)',
    });
  });

  test('converts rgb to hex and hsl', () => {
    const result = convertColor('rgb(0, 255, 0)');
    expect(result).toEqual({
      hex: '#00ff00',
      rgb: 'rgb(0, 255, 0)',
      hsl: 'hsl(120, 100%, 50%)',
    });
  });

  test('returns null for invalid input', () => {
    expect(convertColor('not-a-color')).toBeNull();
  });
});
