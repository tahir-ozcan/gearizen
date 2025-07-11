import { sortLines } from '../lib/sort-lines';

describe('sortLines', () => {
  test('sorts lines ascending', () => {
    expect(sortLines('b\na\nc')).toBe('a\nb\nc');
  });

  test('sorts lines descending', () => {
    expect(sortLines('b\na\nc', { order: 'desc' })).toBe('c\nb\na');
  });

  test('ignores case when requested', () => {
    expect(sortLines('b\nA\nc', { ignoreCase: true })).toBe('A\nb\nc');
  });

  test('removes duplicates', () => {
    expect(sortLines('a\na\nb', { unique: true })).toBe('a\nb');
  });
});
