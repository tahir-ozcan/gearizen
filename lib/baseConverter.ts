export function convertBase(input: string, fromBase: number, toBase: number): string {
  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    throw new Error('Base must be between 2 and 36');
  }
  const negative = input.trim().startsWith('-');
  const digits = negative ? input.trim().slice(1) : input.trim();
  if (digits.length === 0) {
    throw new Error('Invalid input');
  }
  const value = parseBigInt(digits, fromBase);
  const result = toBaseString(value, toBase);
  return negative ? '-' + result : result;
}

function parseBigInt(str: string, base: number): bigint {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  const bigBase = BigInt(base);
  let result = 0n;
  for (const ch of str.toLowerCase()) {
    const val = digits.indexOf(ch);
    if (val === -1 || val >= base) throw new Error('Invalid input');
    result = result * bigBase + BigInt(val);
  }
  return result;
}

function toBaseString(value: bigint, base: number): string {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  if (value === 0n) return '0';
  const bigBase = BigInt(base);
  let v = value;
  let out = '';
  while (v > 0n) {
    const rem = Number(v % bigBase);
    out = digits[rem] + out;
    v /= bigBase;
  }
  return out;
}
