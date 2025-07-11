export interface SlugOptions {
  delimiter?: string;
  lowercase?: boolean;
  removeStopWords?: boolean;
  stopWords?: string[];
}

const DEFAULT_STOP_WORDS = [
  'a',
  'an',
  'and',
  'the',
  'or',
  'for',
  'to',
  'of',
  'in',
];

/**
 * Create a URL-friendly slug from text.
 */
export function slugify(text: string, options: SlugOptions = {}): string {
  const {
    delimiter = '-',
    lowercase = true,
    removeStopWords = false,
    stopWords = DEFAULT_STOP_WORDS,
  } = options;

  // Normalize and remove diacritics
  let str = text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // Replace non-alphanumeric characters with spaces
  str = str.replace(/[^\p{L}\p{N}]+/gu, ' ');

  let words = str.trim().split(/\s+/);

  if (removeStopWords) {
    const set = new Set(stopWords.map((w) => w.toLowerCase()));
    words = words.filter((w) => !set.has(w.toLowerCase()));
  }

  let slug = words.join(delimiter);
  if (lowercase) slug = slug.toLowerCase();
  return slug;
}
