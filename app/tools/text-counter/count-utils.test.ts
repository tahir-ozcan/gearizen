import { countWords, countCharacters } from "./count-utils";

test("counts words correctly", () => {
  expect(countWords("hello world")).toBe(2);
  expect(countWords("  multiple   spaces ")).toBe(2);
  expect(countWords("")).toBe(0);
});

test("counts characters including unicode", () => {
  expect(countCharacters("abc")).toBe(3);
  expect(countCharacters("🙂🙂")).toBe(2);
});
