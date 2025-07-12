const CHAR_TO_MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '$': '...-..-',
  '@': '.--.-.',
};

const MORSE_TO_CHAR = new Map<string, string>();
for (const [char, code] of Object.entries(CHAR_TO_MORSE)) {
  MORSE_TO_CHAR.set(code, char);
}

export function textToMorse(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .split('')
        .map((c) => CHAR_TO_MORSE[c.toUpperCase()] || '')
        .filter(Boolean)
        .join(' ') )
    .join(' / ');
}

export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => {
          const char = MORSE_TO_CHAR.get(code);
          if (!char) throw new Error('Invalid Morse code');
          return char;
        })
        .join('') )
    .join(' ');
}
