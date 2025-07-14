// lib/render-markdown.ts
import DOMPurify from "isomorphic-dompurify";

// — Allow blob URLs so uploaded/generated images render in the preview.
DOMPurify.setConfig({
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|data|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z]|$))/i,
});

// Resolve relative image paths so `![](./foo.png)` works.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "IMG") {
    const src = node.getAttribute("src");
    if (src && !/^(?:[a-z]+:|\/)/i.test(src)) {
      try {
        const base =
          typeof window === "undefined"
            ? "http://localhost/"
            : window.location.href;
        node.setAttribute("src", new URL(src, base).toString());
      } catch {
        /* no-op */
      }
    }
  }
});

/**
 * Dynamically import `marked` and configure it for
 * GFM + hard breaks + synchronous mode.
 */
async function getMarked() {
  const { marked } = await import("marked");
  marked.setOptions({ gfm: true, breaks: true, async: false });
  return marked;
}

/**
 * Render markdown → sanitized HTML.
 */
export async function renderMarkdown(src: string): Promise<string> {
  const marked = await getMarked();

  // `.parse()` is typed as returning `string | Promise<string>`.
  // Force it to a true string by awaiting if needed:
  const result = marked.parse(src ?? "");
  const html = typeof result === "string" ? result : await result;

  return DOMPurify.sanitize(html);
}