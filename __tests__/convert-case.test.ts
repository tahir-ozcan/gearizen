import { convertCase } from "../lib/convert-case";

describe("convertCase", () => {
  test("upper case", () => {
    expect(convertCase("hello", "upper")).toBe("HELLO");
  });
  test("camel case", () => {
    expect(convertCase("hello world", "camel")).toBe("helloWorld");
  });
  test("snake case", () => {
    expect(convertCase("Hello World", "snake")).toBe("hello_world");
  });
});
