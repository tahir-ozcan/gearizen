import { countWords, countCharacters } from "./count-utils";

test("counts words correctly", () => {
  expect(countWords("hello world")).toBe(2);
  expect(countWords("  multiple   spaces ")).toBe(2);
  expect(countWords("")).toBe(0);
});

test("counts characters excluding spaces by default", () => {
  expect(countCharacters("abc")).toBe(3);
  expect(countCharacters("🙂🙂")).toBe(2);
  expect(countCharacters("a b ")).toBe(2);
});

test("counts characters including spaces when specified", () => {
  expect(countCharacters("a b ", true)).toBe(4);
});
