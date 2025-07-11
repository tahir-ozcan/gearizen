import { convertBase } from "../lib/convert-base";

describe("convertBase", () => {
  test("binary to decimal", () => {
    expect(convertBase("1010", 2, 10)).toBe("10");
  });

  test("hex to binary", () => {
    expect(convertBase("A", 16, 2)).toBe("1010");
  });

  test("negative values", () => {
    expect(convertBase("-FF", 16, 10)).toBe("-255");
  });

  test("base36 to decimal", () => {
    expect(convertBase("ZZ", 36, 10)).toBe("1295");
  });
});
