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

const SIMILAR = /[Il1O0]/g;

function randomIndex(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let rand;
  do {
    globalThis.crypto.getRandomValues(arr);
    rand = arr[0];
  } while (rand >= limit);
  return rand % max;
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

  const exclude = !!options.excludeSimilar;
  let pool = "";
  if (options.upper) pool += UPPER;
  if (options.lower) pool += LOWER;
  if (options.digits) pool += DIGITS;
  if (options.symbols) pool += SYMBOLS;
  if (options.excludeSimilar) {
    pool = pool.replace(SIMILAR, "");
  }

  if (!pool) return "";

  const chars = Array.from({ length }, () => randomChar(pool));

  const required: string[] = [];
  const upperSet = options.excludeSimilar ? UPPER.replace(SIMILAR, "") : UPPER;
  const lowerSet = options.excludeSimilar ? LOWER.replace(SIMILAR, "") : LOWER;
  const digitSet = options.excludeSimilar ? DIGITS.replace(SIMILAR, "") : DIGITS;
  const symbolSet = options.excludeSimilar
    ? SYMBOLS.replace(SIMILAR, "")
    : SYMBOLS;
  if (options.upper) required.push(randomChar(upperSet));
  if (options.lower) required.push(randomChar(lowerSet));
  if (options.digits) required.push(randomChar(digitSet));
  if (options.symbols) required.push(randomChar(symbolSet));


  const used = new Set<number>();
  required.forEach((ch) => {
    let idx = randomIndex(length);
    while (used.has(idx)) idx = randomIndex(length);
    used.add(idx);
    chars[idx] = ch;
  });

  return chars.join("");
}
