import { encodeUrl, decodeUrl } from "../lib/urlEncoding";

describe("URL encoding utils", () => {
  test("encode and decode roundtrip", () => {
    const input = "a b&c?d=1";
    const encoded = encodeUrl(input);
    expect(decodeUrl(encoded)).toBe(input);
  });

  test("decode throws on invalid sequence", () => {
    expect(() => decodeUrl("%E0%A4%A")).toThrow("Invalid URL encoding");
  });

  test("decodes plus signs as spaces", () => {
    expect(decodeUrl("a+b%20c")).toBe("a b c");
  });
});
