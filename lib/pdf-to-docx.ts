import { Document, Packer, Paragraph, ImageRun, PageOrientation } from "docx";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  TextContent,
  TextItem,
} from "pdfjs-dist/legacy/build/pdf";

export interface PdfToDocxOptions {
  /** Create text-only doc or embed each page as an image */
  mode: "text" | "image";
  /** When mode is text, also include page snapshots */
  includeImages?: boolean;
  /** Page orientation */
  orientation?: "portrait" | "landscape";
}

/** Convert a PDF file (as ArrayBuffer) to a DOCX Blob using pdfjs and docx */
export async function pdfToDocx(
  arrayBuffer: ArrayBuffer,
  { mode, includeImages = false, orientation = "portrait" }: PdfToDocxOptions,
): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  const worker = (
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs?worker&url")
  ).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const children: Paragraph[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page: PDFPageProxy = await pdf.getPage(i);
    if (mode === "image") {
      const { paragraph } = await renderPageImage(page);
      if (paragraph) children.push(paragraph);
    } else {
      const content: TextContent = await page.getTextContent();
      const text = (content.items as TextItem[])
        .map((item) => item.str)
        .join(" ");
      children.push(new Paragraph(text));
      if (includeImages) {
        const { paragraph } = await renderPageImage(page);
        if (paragraph) children.push(paragraph);
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation:
                orientation === "landscape"
                  ? PageOrientation.LANDSCAPE
                  : PageOrientation.PORTRAIT,
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

async function renderPageImage(
  page: PDFPageProxy,
): Promise<{ paragraph?: Paragraph }> {
  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return {};
  await page.render({ canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/png");
  return {
    paragraph: new Paragraph({
      children: [
        new ImageRun({
          data: dataUrl.split(",")[1],
          transformation: { width: viewport.width, height: viewport.height },
          type: "png",
        }),
      ],
    }),
  };
}
