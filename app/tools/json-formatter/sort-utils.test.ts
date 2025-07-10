import { sortKeysDeep } from './sort-utils';

test('recursively sorts object keys', () => {
  const input = { b: 1, a: { d: 3, c: 2 } };
  const result = sortKeysDeep(input);
  expect(Object.keys(result)).toEqual(['a', 'b']);
  expect(Object.keys((result as any).a)).toEqual(['c', 'd']);
});
