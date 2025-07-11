import { renderMarkdown } from '../app/tools/markdown-to-html/render-markdown';

describe('renderMarkdown', () => {
  test('handles empty input safely', () => {
    expect(renderMarkdown('')).toBe('');
  });

  test('renders markdown to HTML', () => {
    const html = renderMarkdown('# Title\n\n**bold**');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
  });

  test('renders images with blob and relative paths', () => {
    const html = renderMarkdown('![](blob:abc)\n![](foo.png)');
    expect(html).toContain('src="blob:abc"');
    // Tests run in Node where window is undefined, so relative paths resolve to
    // http://localhost/ by default.
    expect(html).toContain('src="http://localhost/foo.png"');
  });
});
