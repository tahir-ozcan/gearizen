import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// Renders markdown to sanitized HTML.
// Configure marked once with GitHub-flavored markdown and line breaks so
// the preview mirrors typical editors.
marked.setOptions({ gfm: true, breaks: true });

export function renderMarkdown(src: string): string {
  // marked.parse returns a string of HTML. DOMPurify removes any dangerous tags
  // to keep the preview safe against XSS attacks.
  return DOMPurify.sanitize(marked.parse(src));
}
