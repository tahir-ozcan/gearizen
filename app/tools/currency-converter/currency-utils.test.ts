import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { calculateConversion } from './currency-utils';

test('formats conversion result', () => {
  assert.is(calculateConversion(2, 1.5), '3.0000');
});

test('handles decimals', () => {
  assert.is(calculateConversion(1.234, 2), '2.4680');
});

test.run();
