import { renderMarkdown } from '../lib/render-markdown';

describe('renderMarkdown utility', () => {
  test('handles empty input safely', () => {
    expect(renderMarkdown('')).toBe('');
  });

  test('renders headers and bold text', () => {
    const html = renderMarkdown('# Title\n\n**bold**');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  test('preserves blob and relative image paths', () => {
    const html = renderMarkdown('![](blob:abc)\n![](foo.png)');
    expect(html).toContain('src="blob:abc"');
    expect(html).toContain('src="http://localhost/foo.png"');
  });
});
