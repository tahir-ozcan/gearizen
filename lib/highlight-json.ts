export function highlightJson(json: string): string {
  const esc = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return esc
    .replace(/"(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:)/g, '<span class="json-key">$&</span>')
    .replace(/"(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"/g, '<span class="json-string">$&</span>')
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\bnull\b/g, '<span class="json-null">null</span>')
    .replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, '<span class="json-number">$1</span>');
}
