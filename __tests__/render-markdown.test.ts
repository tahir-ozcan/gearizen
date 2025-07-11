import { renderMarkdown } from '../app/tools/markdown-previewer/render-markdown';

describe('renderMarkdown', () => {
  test('handles empty input safely', () => {
    expect(renderMarkdown('')).toBe('');
  });
});
