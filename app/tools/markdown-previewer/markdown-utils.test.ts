import { test } from "uvu";
import * as assert from "uvu/assert";
import { markdownToHtml } from "./markdown-utils";

test("converts headings", () => {
  const html = markdownToHtml("# Title");
  assert.ok(html.includes("<h1"));
});

test("sanitizes script tags", () => {
  const html = markdownToHtml("hello <script>alert(1)</script>");
  assert.ok(!html.includes("script"));
});

test.run();
