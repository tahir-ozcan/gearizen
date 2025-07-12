import { formatJson } from '../lib/format-json';

describe('formatJson', () => {
  test('beautifies and sorts keys', async () => {
    const { output, error } = await formatJson('{"b":1,"a":2}', {
      mode: 'beautify',
      indent: 2,
      strict: true,
      sortKeys: true,
    });
    expect(error).toBeNull();
    expect(output).toBe('{' + '\n  "a": 2,\n  "b": 1\n}');
  });

  test('minifies JSON5 when not strict', async () => {
    const { output } = await formatJson('{a:1}', {
      mode: 'minify',
      indent: 2,
      strict: false,
      sortKeys: false,
    });
    expect(output).toBe('{"a":1}');
  });

  test('validates JSON', async () => {
    const { output } = await formatJson('{}', {
      mode: 'validate',
      indent: 2,
      strict: true,
      sortKeys: false,
    });
    expect(output).toBe('Valid JSON');
  });

  test('returns error on invalid JSON', async () => {
    const { error } = await formatJson('{', {
      mode: 'beautify',
      indent: 2,
      strict: true,
      sortKeys: false,
    });
    expect(error).toBeTruthy();
  });
});
