export interface CaesarOptions {
  shift?: number;
  decode?: boolean;
}

/**
 * Encode or decode text using the Caesar cipher.
 * Works with basic Latin letters; non-letters are preserved.
 */
export function caesarCipher(
  text: string,
  { shift = 13, decode = false }: CaesarOptions = {},
): string {
  const s = (((decode ? -shift : shift) % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (char) => {
    const base = char <= "Z" ? 65 : 97;
    const code = char.charCodeAt(0) - base;
    return String.fromCharCode(((code + s) % 26) + base);
  });
}
