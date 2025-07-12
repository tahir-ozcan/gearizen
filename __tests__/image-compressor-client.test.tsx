/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCompressorClient from "../app/tools/image-compressor/image-compressor-client";

describe("ImageCompressorClient", () => {
  test("drop zone is focusable with aria label", () => {
    render(<ImageCompressorClient />);
    const zone = screen.getByRole("button", { name: /upload images/i });
    expect(zone).toHaveAttribute("tabindex", "0");
  });

  test("file input accepts multiple files", async () => {
    const user = userEvent.setup();
    render(<ImageCompressorClient />);
    const input = screen.getByLabelText(/image files/i) as HTMLInputElement;
    const file1 = new File(["a"], "a.png", { type: "image/png" });
    const file2 = new File(["b"], "b.png", { type: "image/png" });
    await user.upload(input, [file1, file2]);
    expect(input.files?.length).toBe(2);
  });
});
