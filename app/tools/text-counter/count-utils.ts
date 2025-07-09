export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).filter(Boolean).length : 0;
}

export function countCharacters(text: string): number {
  return [...text].length;
}
