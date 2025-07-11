export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

export interface CharacterCountOptions {
  /** When true, spaces will be excluded from the character count */
  ignoreSpaces?: boolean;
}

export function countCharacters(
  text: string,
  options: CharacterCountOptions = {}
): number {
  const source = options.ignoreSpaces ? text.replace(/\s/gu, "") : text;
  return Array.from(source).length;
}
