export interface PasswordOptions {
  length: number;
  upper?: boolean;
  lower?: boolean;
  digits?: boolean;
  symbols?: boolean;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:',.<>?/`~";

function randomChar(set: string): string {
  return set.charAt(Math.floor(Math.random() * set.length));
}

/**
 * Generate a cryptographically strong password.
 * Ensures at least one character from each selected set.
 */
export function generatePassword(options: PasswordOptions): string {
  const length = Math.floor(options.length);
  if (length <= 0) return "";

  let pool = "";
  if (options.upper) pool += UPPER;
  if (options.lower) pool += LOWER;
  if (options.digits) pool += DIGITS;
  if (options.symbols) pool += SYMBOLS;
  if (!pool) return "";

  const chars = new Array<string>(length);
  for (let i = 0; i < length; i++) {
    chars[i] = randomChar(pool);
  }

  const required: string[] = [];
  if (options.upper) required.push(randomChar(UPPER));
  if (options.lower) required.push(randomChar(LOWER));
  if (options.digits) required.push(randomChar(DIGITS));
  if (options.symbols) required.push(randomChar(SYMBOLS));

  required.forEach((ch) => {
    const idx = Math.floor(Math.random() * length);
    chars[idx] = ch;
  });

  return chars.join("");
}
