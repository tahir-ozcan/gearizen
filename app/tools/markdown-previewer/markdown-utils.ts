import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

/**
 * Convert markdown text to sanitized HTML.
 */
export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown) as string;
  return DOMPurify.sanitize(raw);
}
