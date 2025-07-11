import {
  countWords,
  countCharacters,
} from "../app/tools/text-counter/count-utils";

describe("text counting", () => {
  test("counts words with various whitespace", () => {
    expect(countWords("one two  three")).toBe(3);
    expect(countWords("\n\tone")).toBe(1);
    expect(countWords("hello, world!")).toBe(2);
  });

  test("counts characters with and without spaces", () => {
    expect(countCharacters("a b c")).toBe(5);
    expect(countCharacters("a b c", { ignoreSpaces: true })).toBe(3);
  });
});
