/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageCompressorClient from "../app/tools/image-compressor/image-compressor-client";

function createFile(name: string) {
  const data = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  return new File([data], name, { type: "image/png" });
}

describe("ImageCompressorClient", () => {
  test("compress action updates preview and captions", async () => {
    const user = userEvent.setup();
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: () => ({ drawImage: jest.fn() }),
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: (cb: (b: Blob) => void) =>
        cb(new Blob(["y"], { type: "image/jpeg" })),
    });
    const urlSpy = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValueOnce("blob:orig")
      .mockReturnValueOnce("blob:compressed");
    Object.defineProperty(window, "Image", {
      writable: true,
      value: class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_v: string) {
          this.onload();
        }
        get naturalWidth() {
          return 100;
        }
        get naturalHeight() {
          return 100;
        }
      },
    });

    render(<ImageCompressorClient />);
    const input = screen.getByLabelText(
      /drag and drop image/i,
    ) as HTMLInputElement;
    await user.upload(input, createFile("a.png"));
    await user.click(screen.getByRole("button", { name: "Compress" }));

    const imgs = await screen.findAllByRole("img");
    expect(imgs).toHaveLength(2);
    expect(imgs[0].getAttribute("src")).toBe("blob:orig");
    expect(imgs[1].getAttribute("src")).toBe("blob:compressed");
    const compressedCaption = screen.getByText(/Compressed/);
    expect(compressedCaption.textContent).toMatch(/reduction/);
    urlSpy.mockRestore();
  });
});
