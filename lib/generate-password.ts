export interface PasswordOptions {
  length: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
  /** Exclude easily confused characters like 1, l, I, O and 0 */
  excludeSimilar?: boolean;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";
const SIMILAR = "Il1O0";

function filterSet(source: string, exclude: boolean): string {
  return exclude ? source.replace(new RegExp(`[${SIMILAR}]`, "g"), "") : source;
}

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  globalThis.crypto.getRandomValues(arr);
  return arr[0] % max;
}

function randomChar(set: string): string {
  return set.charAt(randomIndex(set.length));
}

/**
 * Generate a cryptographically strong password.
 * Ensures at least one character from each selected set.
 */
export function generatePassword(options: PasswordOptions): string {
  const length = Math.floor(options.length);
  if (length <= 0) return "";

  const excludeSimilar = !!options.excludeSimilar;
  let pool = "";
  if (options.upper) pool += filterSet(UPPER, excludeSimilar);
  if (options.lower) pool += filterSet(LOWER, excludeSimilar);
  if (options.digits) pool += filterSet(DIGITS, excludeSimilar);
  if (options.symbols) pool += filterSet(SYMBOLS, excludeSimilar);
  if (!pool) return "";

  const chars = Array.from({ length }, () => randomChar(pool));

  const required: string[] = [];
  if (options.upper) required.push(randomChar(filterSet(UPPER, excludeSimilar)));
  if (options.lower) required.push(randomChar(filterSet(LOWER, excludeSimilar)));
  if (options.digits) required.push(randomChar(filterSet(DIGITS, excludeSimilar)));
  if (options.symbols) required.push(randomChar(filterSet(SYMBOLS, excludeSimilar)));

  const used = new Set<number>();
  required.forEach((ch) => {
    let idx = randomIndex(length);
    while (used.has(idx)) idx = randomIndex(length);
    used.add(idx);
    chars[idx] = ch;
  });

  return chars.join("");
}
