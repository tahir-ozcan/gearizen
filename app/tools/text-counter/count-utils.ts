export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).filter(Boolean).length : 0;
}

export function countCharacters(text: string, includeSpaces = false): number {
  const chars = [...text];
  return includeSpaces ? chars.length : chars.filter((c) => c.trim()).length;
}
