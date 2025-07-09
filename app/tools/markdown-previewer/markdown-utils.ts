import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

/**
 * Convert Markdown text to sanitized HTML.
 */
export function markdownToHtml(md: string): string {
  const raw = marked.parse(md);
  return DOMPurify.sanitize(raw as string);
}
