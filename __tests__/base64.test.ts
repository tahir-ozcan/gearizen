import { encodeBase64, decodeBase64 } from "../lib/base64";

describe("Base64 utils", () => {
  test("encodes and decodes roundtrip", () => {
    const input = "Hello 世界";
    const encoded = encodeBase64(input);
    expect(decodeBase64(encoded)).toBe(input);
  });

  test("decode throws on invalid data", () => {
    expect(() => decodeBase64("*invalid*")).toThrow("Invalid Base64 string");
  });

  test("decodes strings containing whitespace", () => {
    const spaced = "SGVs\n bG8g V29y\n bGQ=";
    expect(decodeBase64(spaced)).toBe("Hello World");
  });
});
