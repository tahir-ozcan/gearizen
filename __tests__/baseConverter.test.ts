import { convertBase } from '../lib/baseConverter';

test('converts decimal to binary', () => {
  expect(convertBase('10', 10, 2)).toBe('1010');
});

test('converts hex to decimal', () => {
  expect(convertBase('ff', 16, 10)).toBe('255');
});

test('handles negative numbers', () => {
  expect(convertBase('-42', 10, 16)).toBe('-2a');
});

test('throws on invalid input', () => {
  expect(() => convertBase('g', 16, 10)).toThrow('Invalid input');
});
