export interface SortLinesOptions {
  order?: 'asc' | 'desc';
  ignoreCase?: boolean;
  unique?: boolean;
}

/** Sort lines of text with optional case-insensitivity and deduplication */
export function sortLines(
  text: string,
  { order = 'asc', ignoreCase = false, unique = false }: SortLinesOptions = {}
): string {
  let lines = text.split(/\r?\n/);
  if (ignoreCase) {
    lines = lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  } else {
    lines = lines.sort();
  }
  if (order === 'desc') {
    lines = lines.reverse();
  }
  if (unique) {
    lines = Array.from(new Set(lines));
  }
  return lines.join('\n');
}
