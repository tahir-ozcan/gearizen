export interface PasswordOptions {
  length?: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  /** Exclude easily confused characters like 1, l, I, O and 0 */
  excludeSimilar?: boolean;
  /** Pattern string using A (upper), a (lower), 0 (digit), $ (symbol) */
  pattern?: string;
  /** Avoid consecutive repeated characters */
  avoidRepeats?: boolean;
  /** Minimum number of uppercase characters */
  minUpper?: number;
  /** Minimum number of lowercase characters */
  minLower?: number;
  /** Minimum number of digit characters */
  minDigits?: number;
  /** Minimum number of symbol characters */
  minSymbols?: number;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";
const SIMILAR = "Il1O0";

function filterSet(source: string, exclude: boolean): string {
  return exclude ? source.replace(new RegExp(`[${SIMILAR}]`, "g"), "") : source;
}

function randomIndices(count: number, max: number): number[] {
  const arr = new Uint32Array(count);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v % max);
}

function randomChar(set: string): string {
  return set.charAt(randomIndices(1, set.length)[0]);
}

/**
 * Generate a cryptographically strong password.
 * Ensures at least one character from each selected set.
 */
export function generatePassword(options: PasswordOptions): string {
  const excludeSimilar = !!options.excludeSimilar;

  // Pattern mode ignores other configuration besides excludeSimilar and
  // avoidRepeats. '?' and '*' pull from the full character pool.
  if (options.pattern) {
    const pattern = options.pattern;
    const anySet = filterSet(
      UPPER + LOWER + DIGITS + SYMBOLS,
      excludeSimilar,
    );
    const out: string[] = [];
    for (const char of pattern) {
      let next = char;
      switch (char) {
        case "A":
          next = randomChar(filterSet(UPPER, excludeSimilar));
          break;
        case "a":
          next = randomChar(filterSet(LOWER, excludeSimilar));
          break;
        case "0":
          next = randomChar(filterSet(DIGITS, excludeSimilar));
          break;
        case "$":
          next = randomChar(filterSet(SYMBOLS, excludeSimilar));
          break;
        case "?":
        case "*":
          next = randomChar(anySet);
          break;
        default:
          next = char;
      }
      if (options.avoidRepeats && out[out.length - 1] === next) {
        let alt = randomChar(anySet);
        while (alt === next) alt = randomChar(anySet);
        next = alt;
      }
      out.push(next);
    }
    return out.join("");
  }

  const requestedLength = Math.floor(options.length ?? 0);
  if (requestedLength <= 0) return "";

  let pool = "";
  if (options.upper) pool += filterSet(UPPER, excludeSimilar);
  if (options.lower) pool += filterSet(LOWER, excludeSimilar);
  if (options.digits) pool += filterSet(DIGITS, excludeSimilar);
  if (options.symbols) pool += filterSet(SYMBOLS, excludeSimilar);
  if (!pool) return "";

  const minUpper = options.upper ? Math.max(options.minUpper ?? 1, 0) : 0;
  const minLower = options.lower ? Math.max(options.minLower ?? 1, 0) : 0;
  const minDigits = options.digits ? Math.max(options.minDigits ?? 1, 0) : 0;
  const minSymbols = options.symbols ? Math.max(options.minSymbols ?? 1, 0) : 0;

  const required: string[] = [];
  for (let i = 0; i < minUpper; i++)
    required.push(randomChar(filterSet(UPPER, excludeSimilar)));
  for (let i = 0; i < minLower; i++)
    required.push(randomChar(filterSet(LOWER, excludeSimilar)));
  for (let i = 0; i < minDigits; i++)
    required.push(randomChar(filterSet(DIGITS, excludeSimilar)));
  for (let i = 0; i < minSymbols; i++)
    required.push(randomChar(filterSet(SYMBOLS, excludeSimilar)));

  const finalLength = Math.max(requestedLength, required.length);
  const chars = Array.from({ length: finalLength }, () => randomChar(pool));

  const used = new Set<number>();
  while (used.size < required.length) {
    used.add(randomIndices(1, finalLength)[0]);
  }
  const positions = Array.from(used);
  required.forEach((ch, i) => {
    chars[positions[i]] = ch;
  });

  if (options.avoidRepeats) {
    for (let i = 1; i < chars.length; i++) {
      if (chars[i] === chars[i - 1]) {
        let next = randomChar(pool);
        while (next === chars[i - 1]) next = randomChar(pool);
        chars[i] = next;
      }
    }
  }

  return chars.join("");
}
