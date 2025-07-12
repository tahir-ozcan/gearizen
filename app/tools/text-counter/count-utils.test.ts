import { countWords, countCharacters, estimateReadingTime } from "./count-utils";

test("counts words correctly", () => {
  expect(countWords("hello world")).toBe(2);
  expect(countWords("  multiple   spaces ")).toBe(2);
  expect(countWords("hello, world!")).toBe(2);
  expect(countWords("")).toBe(0);
});

test("counts characters including unicode", () => {
  expect(countCharacters("abc")).toBe(3);
  expect(countCharacters("🙂🙂")).toBe(2);
  expect(countCharacters("a b ")).toBe(4);
  expect(countCharacters("a b", { ignoreSpaces: true })).toBe(2);
});

test("estimates reading time in minutes", () => {
  expect(estimateReadingTime("one two three four", 200)).toBe(1);
  expect(estimateReadingTime("")).toBe(0);
});
