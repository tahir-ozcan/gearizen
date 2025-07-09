import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { convert } from './unit-converter-client';

test('converts meters to kilometers', () => {
  assert.is(convert('length', 'm', 'km', 1000), 1);
});

test('converts kilometers to meters', () => {
  assert.is(convert('length', 'km', 'm', 1), 1000);
});

test('converts Celsius to Fahrenheit', () => {
  assert.is(convert('temperature', 'C', 'F', 0), 32);
});

test('converts Fahrenheit to Celsius', () => {
  assert.is(convert('temperature', 'F', 'C', 32), 0);
});

test.run();
