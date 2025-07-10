import { renderMarkdown } from './render-markdown';

// Basic markdown rendering
// Ensures headers and bold text are converted to HTML correctly.
test('renders markdown to HTML', () => {
  const html = renderMarkdown('# Title\n\n**bold**');
  expect(html).toContain('<h1>Title</h1>');
  expect(html).toContain('<strong>bold</strong>');
});

test('renders lists and code blocks', () => {
  const src = '- item\n- item2\n\n```js\nconst a = 1;\n```';
  const html = renderMarkdown(src);
  expect(html).toContain('<li>item</li>');
  expect(html).toContain('<code');
});
