import { convert } from './unit-converter-client';

test('converts meters to kilometers', () => {
  expect(convert('length', 'm', 'km', 1000)).toBe(1);
});

test('converts kilometers to meters', () => {
  expect(convert('length', 'km', 'm', 1)).toBe(1000);
});

test('converts Celsius to Fahrenheit', () => {
  expect(convert('temperature', 'C', 'F', 0)).toBe(32);
});

test('converts Fahrenheit to Celsius', () => {
  expect(convert('temperature', 'F', 'C', 32)).toBe(0);
});
