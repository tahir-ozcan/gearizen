import { generatePassword } from "../lib/generate-password";

describe("generatePassword", () => {
  test("generates password of requested length", () => {
    const pwd = generatePassword({
      length: 12,
      upper: true,
      lower: true,
      digits: true,
    });
    expect(pwd).toHaveLength(12);
  });

  test("includes required character types", () => {
    const pwd = generatePassword({
      length: 20,
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
    });
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~]/.test(pwd)).toBe(true);
  });

  test("returns empty string when no sets selected", () => {
    expect(generatePassword({ length: 10 })).toBe("");
  });

  test("works with minimal length and all char sets", () => {
    const pwd = generatePassword({
      length: 4,
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
    });
    expect(pwd).toHaveLength(4);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~]/.test(pwd)).toBe(true);
  });

  test("excludes similar characters when requested", () => {
    const pwd = generatePassword({
      length: 20,
      upper: true,
      lower: true,
      digits: true,
      excludeSimilar: true,
    });
    expect(/[Il1O0]/.test(pwd)).toBe(false);
  });
});
