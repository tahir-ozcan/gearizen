/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorContrastCheckerClient from "../app/tools/color-contrast-checker/color-contrast-checker-client";

describe("ColorContrastCheckerClient", () => {
  test("updates ratio and sample on input", async () => {
    const user = userEvent.setup();
    render(<ColorContrastCheckerClient />);
    const fgInput = screen.getByLabelText("Text color value");
    const bgInput = screen.getByLabelText("Background color value");
    await user.clear(fgInput);
    await user.type(fgInput, "#777777");
    await user.clear(bgInput);
    await user.type(bgInput, "#ffffff");
    const ratio = await screen.findByText(/Contrast Ratio/i);
    expect(ratio.textContent).toContain("4");
    const sample = screen.getByLabelText("Sample text panel");
    expect(sample).toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" });
  });
});
