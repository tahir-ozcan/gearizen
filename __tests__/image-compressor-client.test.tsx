/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCompressorClient from "../app/tools/image-compressor/image-compressor-client";

function createFile(name: string) {
  const data = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  return new File([data], name, { type: "image/png" });
}

describe("ImageCompressorClient file handling", () => {
  test("shows preview after file upload", async () => {
    const user = userEvent.setup();
    render(<ImageCompressorClient />);
    const input = screen.getByLabelText(/drag and drop/i) as HTMLInputElement;
    await user.upload(input, [createFile("a.png")]);
    const preview = await screen.findByAltText(/Original image/i);
    expect(preview).toBeInTheDocument();
  });

  test("renders compressed preview after compression", async () => {
    const user = userEvent.setup();
    // mock canvas methods
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: () => ({ drawImage: jest.fn() }),
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: (cb: (b: Blob) => void) =>
        cb(new Blob(["x"], { type: "image/png" })),
    });
    const urlSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test");
    // auto load Image
    Object.defineProperty(window, "Image", {
      writable: true,
      value: class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_v: string) {
          this.onload();
        }
      },
    });

    render(<ImageCompressorClient />);
    const input = screen.getByLabelText(/drag and drop/i) as HTMLInputElement;
    await user.upload(input, [createFile("a.png")]);
    await user.click(screen.getByRole("button", { name: /compress/i }));
    const img = await screen.findByAltText(/compressed image/i);
    expect(img).toHaveAttribute("src", "blob:test");
    urlSpy.mockRestore();
  });
});
