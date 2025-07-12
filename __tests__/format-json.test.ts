import { formatJson } from '../lib/format-json';

describe('formatJson', () => {
  test('beautifies JSON', async () => {
    const result = await formatJson('{"a":1}', {
      mode: 'beautify',
      indent: 2,
      strict: true,
      sortKeys: false,
    });
    expect(result).toBe('{' + '\n  "a": 1\n}');
  });

  test('minifies JSON', async () => {
    const result = await formatJson('\n{ "a" : 1 } ', {
      mode: 'minify',
      indent: 2,
      strict: true,
      sortKeys: false,
    });
    expect(result).toBe('{"a":1}');
  });

  test('validates and sorts keys using JSON5 parser', async () => {
    const result = await formatJson('{a:1,b:2}', {
      mode: 'validate',
      indent: 2,
      strict: false,
      sortKeys: true,
    });
    expect(result).toBe('Valid JSON');
  });
});
