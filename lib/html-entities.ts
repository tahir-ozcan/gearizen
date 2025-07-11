export function encodeHtmlEntities(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, ch => map[ch]);
}

export function decodeHtmlEntities(input: string): string {
  const named: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  let result = input.replace(/&(amp|lt|gt|quot|#39);/g, m => named[m]);
  result = result.replace(/&#(x?[0-9a-fA-F]+);/g, (_, code) => {
    const num = code.startsWith('x') || code.startsWith('X')
      ? parseInt(code.slice(1), 16)
      : parseInt(code, 10);
    return String.fromCodePoint(num);
  });
  return result;
}
