import type { PDFDocumentProxy, PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import { Document, Packer, Paragraph, ImageRun, PageBreak } from 'docx';

export interface PdfToWordOptions {
  startPage?: number;
  endPage?: number;
  method?: 'text' | 'image';
  pageBreaks?: boolean;
}

export interface DocxOptions {
  pageBreaks?: boolean;
}

/**
 * Create a Word document from an array of page texts.
 */
export async function textsToDocx(
  pages: string[],
  options: DocxOptions = {}
): Promise<Blob | Buffer> {
  const children = pages.map((t) => new Paragraph(t));
  if (options.pageBreaks && pages.length > 1) {
    for (let i = 1; i < children.length; i++) {
      children.splice(i * 2 - 1, 0, new Paragraph({ children: [new PageBreak()] }));
    }
  }
  const doc = new Document({ sections: [{ children }] });
  if (typeof Blob === 'undefined') {
    return Packer.toBuffer(doc);
  }
  return Packer.toBlob(doc);
}

/**
 * Convert a PDF ArrayBuffer to a Word document Blob or Buffer depending on the environment.
 */
export async function pdfToWord(
  arrayBuffer: ArrayBuffer,
  options: PdfToWordOptions = {}
): Promise<Blob | Buffer> {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // disable worker for universal compatibility (tests run in Node)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true } as any);
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  const start = Math.max(1, options.startPage ?? 1);
  const end = Math.min(pdf.numPages, options.endPage ?? pdf.numPages);

  const children: Paragraph[] = [];
  const texts: string[] = [];
  for (let i = start; i <= end; i++) {
    const page: PDFPageProxy = await pdf.getPage(i);
    if (options.method === 'image') {
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );
        if (blob) {
          const data = await blob.arrayBuffer();
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data,
                  transformation: {
                    width: viewport.width,
                    height: viewport.height,
                  },
                  type: 'png',
                }),
              ],
            })
          );
        }
      }
    } else {
      const content: TextContent = await page.getTextContent();
      const text = (content.items as TextItem[]).map((t) => t.str).join(' ');
      texts.push(text);
    }
    if (options.pageBreaks && options.method === 'image' && i < end) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  if (options.method === 'image') {
    const doc = new Document({ sections: [{ children }] });
    if (typeof Blob === 'undefined') {
      return Packer.toBuffer(doc);
    }
    return Packer.toBlob(doc);
  }

  return textsToDocx(texts, { pageBreaks: options.pageBreaks });
}
