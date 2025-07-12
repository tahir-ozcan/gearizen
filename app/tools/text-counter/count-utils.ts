export function countWords(text: string): number {
  const matches = text.match(/[\p{L}\p{N}]+/gu);
  return matches ? matches.length : 0;
}

export interface CharacterCountOptions {
  /** When true, spaces will be excluded from the character count */
  ignoreSpaces?: boolean;
}

export function countCharacters(
  text: string,
  options: CharacterCountOptions = {},
): number {
  const source = options.ignoreSpaces ? text.replace(/\s/gu, "") : text;
  return Array.from(source).length;
}

export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = countWords(text);
  return wordsPerMinute > 0 ? Math.ceil(words / wordsPerMinute) : 0;
}
