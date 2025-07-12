/** @jest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPaletteGeneratorClient from "../app/tools/color-palette-generator/color-palette-generator-client";

function getSwatches() {
  return screen.getAllByRole("button", { name: /copy/i });
}

describe("ColorPaletteGeneratorClient", () => {
  test("updates palette count via slider", () => {
    render(<ColorPaletteGeneratorClient />);
    const slider = screen.getByLabelText(/colors/i);
    fireEvent.change(slider, { target: { value: "4" } });
    expect(getSwatches().length).toBe(4);
  });

  test("download JSON triggers blob URL", async () => {
    const user = userEvent.setup();
    const createSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:1");
    render(<ColorPaletteGeneratorClient />);
    const button = screen.getByRole("button", { name: /download json/i });
    await user.click(button);
    expect(createSpy).toHaveBeenCalled();
    createSpy.mockRestore();
  });
});
