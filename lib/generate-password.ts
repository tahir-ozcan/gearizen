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
  const excludeSimilar = !!options.excludeSimilar;

  // Pattern mode
  if (options.pattern) {
    const pattern = options.pattern;
    const out: string[] = [];
    for (const char of pattern) {
      switch (char) {
        case "A":
          out.push(randomChar(filterSet(UPPER, excludeSimilar)));
          break;
        case "a":
          out.push(randomChar(filterSet(LOWER, excludeSimilar)));
          break;
        case "0":
          out.push(randomChar(filterSet(DIGITS, excludeSimilar)));
          break;
        case "$":
          out.push(randomChar(filterSet(SYMBOLS, excludeSimilar)));
          break;
        case "?":
        case "*":
          out.push(
            randomChar(
              (options.upper ? filterSet(UPPER, excludeSimilar) : "") +
                (options.lower ? filterSet(LOWER, excludeSimilar) : "") +
                (options.digits ? filterSet(DIGITS, excludeSimilar) : "") +
                (options.symbols ? filterSet(SYMBOLS, excludeSimilar) : "") ||
                UPPER + LOWER + DIGITS,
            ),
          );
          break;
        default:
          out.push(char);
      }
    }
    return out.join("");
  }

  const length = Math.floor(options.length ?? 0);
  if (length <= 0) return "";

  let pool = "";
  if (options.upper) pool += filterSet(UPPER, excludeSimilar);
  if (options.lower) pool += filterSet(LOWER, excludeSimilar);
  if (options.digits) pool += filterSet(DIGITS, excludeSimilar);
  if (options.symbols) pool += filterSet(SYMBOLS, excludeSimilar);
  if (!pool) return "";

  const chars = Array.from({ length }, () => randomChar(pool));

  const required: string[] = [];
  if (options.upper)
    required.push(randomChar(filterSet(UPPER, excludeSimilar)));
  if (options.lower)
    required.push(randomChar(filterSet(LOWER, excludeSimilar)));
  if (options.digits)
    required.push(randomChar(filterSet(DIGITS, excludeSimilar)));
  if (options.symbols)
    required.push(randomChar(filterSet(SYMBOLS, excludeSimilar)));

  const used = new Set<number>();
  required.forEach((ch) => {
    let idx = randomIndex(length);
    while (used.has(idx)) idx = randomIndex(length);
    used.add(idx);
    chars[idx] = ch;
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
