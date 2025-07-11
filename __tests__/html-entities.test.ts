import { encodeHtmlEntities, decodeHtmlEntities } from "../lib/html-entities";

describe("HTML entity utils", () => {
  test("encodes and decodes roundtrip", () => {
    const input = "<div class=\"a\">Hello & 世界</div>";
    const encoded = encodeHtmlEntities(input);
    expect(decodeHtmlEntities(encoded)).toBe(input);
  });

  test("decodes numeric entities", () => {
    const input = "&#60;&#x67;";
    expect(decodeHtmlEntities(input)).toBe("<g");
  });
});
