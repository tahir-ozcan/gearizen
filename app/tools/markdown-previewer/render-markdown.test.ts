import { renderMarkdown } from './render-markdown';

// Basic markdown rendering
// Ensures headers and bold text are converted to HTML correctly.
test('renders markdown to HTML', () => {
  const html = renderMarkdown('# Title\n\n**bold**');
  expect(html).toContain('<h1>Title</h1>');
  expect(html).toContain('<strong>bold</strong>');
});

// Images using blob URLs should be preserved so local uploads show in the
// preview. Relative paths are resolved against the current origin.
test('renders images with blob and relative paths', () => {
  const html = renderMarkdown('![](blob:abc)\n![](foo.png)');
  expect(html).toContain('src="blob:abc"');
  // Tests run in Node where window is undefined, so relative paths resolve to
  // http://localhost/ by default.
  expect(html).toContain('src="http://localhost/foo.png"');
});
