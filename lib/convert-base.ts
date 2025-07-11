const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function parseToBigInt(value: string, base: number): bigint {
  let result = 0n;
  for (const char of value.toUpperCase()) {
    const digit = DIGITS.indexOf(char);
    if (digit < 0 || digit >= base) {
      throw new Error("Invalid digit for base " + base);
    }
    result = result * BigInt(base) + BigInt(digit);
  }
  return result;
}

function bigIntToString(value: bigint, base: number): string {
  if (value === 0n) return "0";
  let n = value;
  let result = "";
  const b = BigInt(base);
  while (n > 0n) {
    const digit = Number(n % b);
    result = DIGITS[digit] + result;
    n /= b;
  }
  return result;
}

/**
 * Convert a number string from one base to another.
 * Supports bases from 2 to 36 and arbitrary-length integers.
 */
export function convertBase(value: string, fromBase: number, toBase: number): string {
  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    throw new Error("Base must be between 2 and 36");
  }
  if (!value) return "0";
  const negative = value.startsWith("-");
  const digits = negative ? value.slice(1) : value;
  const parsed = parseToBigInt(digits, fromBase);
  const converted = bigIntToString(parsed, toBase);
  return negative && converted !== "0" ? "-" + converted : converted;
}
