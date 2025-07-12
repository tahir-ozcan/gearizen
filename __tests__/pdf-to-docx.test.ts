import { pdfToDocx } from "../lib/pdf-to-docx";
import { PDFDocument } from "pdf-lib";

jest.mock("pdfjs-dist/legacy/build/pdf", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: async () => ({
        getTextContent: async () => ({ items: [{ str: "Hello" }] }),
        getViewport: () => ({ width: 100, height: 100 }),
        render: () => ({ promise: Promise.resolve() }),
      }),
    }),
  }),
}));
jest.mock(
  "pdfjs-dist/legacy/build/pdf.worker.mjs?worker&url",
  () => ({
    default: "worker",
  }),
  { virtual: true },
);

async function createSamplePdf(): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([200, 200]);
  page.drawText("Hello World", { x: 50, y: 150 });
  const bytes = await pdfDoc.save();
  return bytes.buffer;
}

describe("pdfToDocx", () => {
  test("converts simple PDF to DOCX blob", async () => {
    const buffer = await createSamplePdf();
    const blob = await pdfToDocx(buffer, { mode: "text" });
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toContain("officedocument");
  });
});
