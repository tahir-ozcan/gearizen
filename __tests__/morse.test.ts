import { textToMorse, morseToText } from '../lib/morse';

describe('morse converter', () => {
  test('encode text to morse', () => {
    expect(textToMorse('SOS')).toBe('... --- ...');
  });

  test('decode morse to text', () => {
    expect(morseToText('... --- ...')).toBe('SOS');
  });

  test('roundtrip with words', () => {
    const text = 'HELLO WORLD';
    expect(morseToText(textToMorse(text))).toBe(text);
  });
});
