import { generatePalette } from "../lib/color-palette";

describe("generatePalette", () => {
  test("complementary palette base cases", () => {
    expect(generatePalette("#ff0000", "complementary", 2)).toEqual([
      "#ff0000",
      "#00ffff",
    ]);
  });

  test("triadic palette base cases", () => {
    expect(generatePalette("#ff0000", "triadic", 3)).toEqual([
      "#ff0000",
      "#00ff00",
      "#0000ff",
    ]);
  });

  test("tetradic palette count", () => {
    expect(generatePalette("#ff0000", "tetradic", 4)).toHaveLength(4);
  });

  test("monochromatic palette count", () => {
    expect(generatePalette("#ff0000", "monochromatic", 6)).toHaveLength(6);
  });

  test("analogous variable count", () => {
    expect(generatePalette("#ff0000", "analogous", 7)).toHaveLength(7);
  });

  test.each([
    "analogous",
    "complementary",
    "triadic",
    "tetradic",
    "monochromatic",
  ] as const)("exact count for %s scheme", (scheme) => {
    expect(generatePalette("#123456", scheme, 8)).toHaveLength(8);
  });
});
