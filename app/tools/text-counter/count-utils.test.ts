import { test } from "uvu";
import * as assert from "uvu/assert";
import { countWords, countCharacters } from "./count-utils";

test("counts words correctly", () => {
  assert.is(countWords("hello world"), 2);
  assert.is(countWords("  multiple   spaces "), 2);
  assert.is(countWords(""), 0);
});

test("counts characters including unicode", () => {
  assert.is(countCharacters("abc"), 3);
  assert.is(countCharacters("🙂🙂"), 2);
});

test.run();
