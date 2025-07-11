import { parseUrl } from "../lib/parse-url";

describe("parseUrl", () => {
  test("parses standard URL", () => {
    const res = parseUrl("https://example.com:8080/path?x=1#top");
    expect(res.protocol).toBe("https:");
    expect(res.host).toBe("example.com:8080");
    expect(res.pathname).toBe("/path");
    expect(res.hash).toBe("#top");
    expect(res.params).toEqual({ x: "1" });
  });

  test("adds protocol if missing", () => {
    const res = parseUrl("example.com/foo");
    expect(res.hostname).toBe("example.com");
    expect(res.pathname).toBe("/foo");
  });

  test("throws on invalid input", () => {
    expect(() => parseUrl("???")).toThrow("Invalid URL");
  });
});
