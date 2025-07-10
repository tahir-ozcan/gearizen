import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

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
