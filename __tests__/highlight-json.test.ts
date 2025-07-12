import { highlightJson } from '../lib/highlight-json';

describe('highlightJson', () => {
  test('wraps keys and numbers with span tags', () => {
    const html = highlightJson('{"a":1}');
    expect(html).toContain('json-key');
    expect(html).toContain('json-number');
  });

  test('escapes html characters', () => {
    const html = highlightJson('{"a":"<b>"}');
    expect(html).toContain('&lt;b&gt;');
  });
});
