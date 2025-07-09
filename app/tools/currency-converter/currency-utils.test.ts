import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { calculateConversion } from './currency-utils';

test('calculates conversion with valid numbers', () => {
  assert.is(calculateConversion(2, 1.5), '3.0000');
});

test('returns empty string for invalid numbers', () => {
  assert.is(calculateConversion(NaN, 1.2), '');
  assert.is(calculateConversion(1, NaN), '');
});

test.run();
