import { calculateConversion } from './currency-utils';

test('calculates conversion with valid numbers', () => {
  expect(calculateConversion(2, 1.5)).toBe('3.0000');
});

test('returns empty string for invalid numbers', () => {
  expect(calculateConversion(NaN, 1.2)).toBe('');
  expect(calculateConversion(1, NaN)).toBe('');
});
