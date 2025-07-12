/** @jest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextDiffClient from "../app/tools/text-diff/text-diff-client";

describe("TextDiffClient", () => {
  test("renders diff output", async () => {
    const user = userEvent.setup();
    render(React.createElement(TextDiffClient));
    const original = screen.getByLabelText("Original Text");
    const modified = screen.getByLabelText("Modified Text");
    await user.type(original, "hello world");
    await user.type(modified, "hello brave world");
    await user.click(
      screen.getByRole("button", { name: /compare & highlight/i }),
    );
    const span = await screen.findByText(/brave/, { selector: "span" });
    expect(span.getAttribute("class")).toContain("bg-green-100");
    expect(
      screen.getByRole("button", { name: /copy diff html/i }),
    ).toBeTruthy();
  });
});
