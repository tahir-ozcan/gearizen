import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// Allow blob URLs so uploaded or generated images render in the preview.
DOMPurify.setConfig({
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data|blob):|[^a-z]|[a-z+.-]+(?:[^a-z]|$))/i,
});

// Resolve relative image paths against the current page location so
// Markdown like `![](./foo.png)` shows correctly in the preview.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src');
    if (src && !/^(?:[a-z]+:|\/)/i.test(src)) {
      try {
        const base =
          typeof window === 'undefined' ? 'http://localhost/' : window.location.href;
        node.setAttribute('src', new URL(src, base).toString());
      } catch {
        /* noop */
      }
    }
  }
});

// Renders markdown to sanitized HTML.
// Configure marked once with GitHub-flavored markdown and line breaks so
// the preview mirrors typical editors.
// Disable async mode so marked.parse always returns a string.
marked.setOptions({ gfm: true, breaks: true, async: false });

export function renderMarkdown(src: string): string {
  // marked.parse returns a string (because async is disabled above). DOMPurify
  // sanitizes the HTML to keep the preview safe against XSS attacks.
  return DOMPurify.sanitize(marked.parse(src) as string);
}
