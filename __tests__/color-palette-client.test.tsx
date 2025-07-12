/** @jest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorPaletteGeneratorClient from "../app/tools/color-palette-generator/color-palette-generator-client";

function getSwatches() {
  return screen.getAllByRole("button", { name: /color/i });
}

describe("ColorPaletteGeneratorClient", () => {
  test("updates palette count via slider", () => {
    render(<ColorPaletteGeneratorClient />);
    const slider = screen.getByLabelText(/colors/i);
    fireEvent.change(slider, { target: { value: "7" } });
    expect(getSwatches().length).toBe(7);
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

  test.each([3, 7, 10])(
    "maintains %i swatches across scheme and color changes",
    async (count) => {
      const user = userEvent.setup();
      render(<ColorPaletteGeneratorClient />);
      const slider = screen.getByLabelText(/colors/i) as HTMLInputElement;
      fireEvent.change(slider, { target: { value: String(count) } });
      const base = screen.getByLabelText(/base color/i);
      const schemes = [
        /analogous/i,
        /complementary/i,
        /triadic/i,
        /tetradic/i,
        /monochromatic/i,
      ];
      for (const scheme of schemes) {
        await user.click(screen.getByRole("radio", { name: scheme }));
        expect(slider.value).toBe(String(count));
        expect(getSwatches().length).toBe(count);
        fireEvent.change(base, { target: { value: "#00ff00" } });
        expect(slider.value).toBe(String(count));
        expect(getSwatches().length).toBe(count);
      }
    },
  );

  test("integration flow maintains count", async () => {
    const user = userEvent.setup();
    render(<ColorPaletteGeneratorClient />);
    const slider = screen.getByLabelText(/colors/i) as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "5" } });
    expect(getSwatches().length).toBe(5);
    await user.click(screen.getByRole("radio", { name: /triadic/i }));
    expect(slider.value).toBe("5");
    expect(getSwatches().length).toBe(5);
    fireEvent.change(screen.getByLabelText(/base color/i), {
      target: { value: "#abcdef" },
    });
    expect(slider.value).toBe("5");
    expect(getSwatches().length).toBe(5);
  });
});
