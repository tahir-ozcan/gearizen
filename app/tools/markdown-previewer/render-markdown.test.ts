import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { renderMarkdown } from './render-markdown';

// Basic markdown rendering
// Ensures headers and bold text are converted to HTML correctly.
test('renders markdown to HTML', () => {
  const html = renderMarkdown('# Title\n\n**bold**');
  assert.ok(html.includes('<h1>Title</h1>'));
  assert.ok(html.includes('<strong>bold</strong>'));
});

test.run();
