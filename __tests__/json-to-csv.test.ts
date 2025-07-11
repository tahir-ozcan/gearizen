import { jsonToCsv } from '../lib/jsonToCsv';

describe('jsonToCsv', () => {
  test('converts array of objects to csv', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
    const csv = jsonToCsv(data);
    expect(csv).toBe('name,age\nAlice,30\nBob,25');
  });

  test('escapes quotes and commas', () => {
    const data = [
      { text: 'Hello, "World"' }
    ];
    const csv = jsonToCsv(data);
    expect(csv).toBe('text\n"Hello, ""World"""');
  });
});
