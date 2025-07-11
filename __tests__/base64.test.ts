import { encodeBase64, decodeBase64 } from '../lib/base64';

describe('Base64 utils', () => {
  test('encodes and decodes roundtrip', () => {
    const input = 'Hello 世界';
    const encoded = encodeBase64(input);
    expect(decodeBase64(encoded)).toBe(input);
  });

  test('decode throws on invalid data', () => {
    expect(() => decodeBase64('*invalid*')).toThrow('Invalid Base64 string');
  });
});
