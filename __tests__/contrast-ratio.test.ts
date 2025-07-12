import { calculateContrast } from "../lib/contrast-ratio";

describe("calculateContrast", () => {
  test("black on white returns 21", () => {
    const res = calculateContrast("#000", "#fff");
    expect(res.ratio).toBeCloseTo(21, 2);
  });

  test("handles named colors and rgb", () => {
    const res = calculateContrast("red", "rgb(255,255,255)");
    expect(res.ratio).toBeCloseTo(4, 1);
  });

  test("resolves css variables", () => {
    const res = calculateContrast("var(--fg)", "var(--bg)", {
      "--fg": "#000000",
      "--bg": "#ffffff",
    });
    expect(res.ratio).toBeCloseTo(21, 2);
  });
});
