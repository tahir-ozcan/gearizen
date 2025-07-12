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

  test("generates using pattern", () => {
    const pwd = generatePassword({
      pattern: "Aa0$",
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
    });
    expect(/[A-Z]/.test(pwd[0])).toBe(true);
    expect(/[a-z]/.test(pwd[1])).toBe(true);
    expect(/[0-9]/.test(pwd[2])).toBe(true);
    expect(/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~]/.test(pwd[3])).toBe(true);
  });

  test("pattern '?' respects selected sets", () => {
    const pwd = generatePassword({
      pattern: "???",
      upper: true,
      digits: true,
      lower: false,
      symbols: false,
    });
    expect(/^[A-Z0-9]{3}$/.test(pwd)).toBe(true);
  });

  test("avoids consecutive repeats", () => {
    const pwd = generatePassword({
      length: 50,
      upper: true,
      lower: true,
      avoidRepeats: true,
    });
    expect(/(.)\1/.test(pwd)).toBe(false);
  });

  test("respects minimum counts", () => {
    const pwd = generatePassword({
      length: 8,
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
      minUpper: 2,
      minLower: 2,
      minDigits: 2,
      minSymbols: 2,
    });
    expect(pwd.match(/[A-Z]/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(pwd.match(/[a-z]/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(pwd.match(/[0-9]/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(
      pwd.match(/[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~]/g)?.length ?? 0,
    ).toBeGreaterThanOrEqual(2);
    expect(pwd.length).toBeGreaterThanOrEqual(8);
  });

  test("length expands to meet minimum counts", () => {
    const pwd = generatePassword({
      length: 4,
      upper: true,
      lower: true,
      digits: true,
      symbols: true,
      minUpper: 2,
      minLower: 2,
      minDigits: 2,
      minSymbols: 2,
    });
    expect(pwd.length).toBe(8);
  });
});
