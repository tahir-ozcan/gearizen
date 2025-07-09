import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { markdownToHtml } from './markdown-utils';

test('converts heading markdown', () => {
  const html = markdownToHtml('# Title');
  assert.ok(html.includes('<h1'));  // basic check
});

test('sanitizes script tags', () => {
  const html = markdownToHtml('hi <script>alert(1)</script>');
  assert.ok(!html.includes('script'));  // script tags removed
});

test.run();
