// types/pdfjs-dist-legacy.d.ts

/**
 * Minimal types for the PDF.js “legacy” ESM build
 * (we import at runtime in the browser).
 */
declare module "pdfjs-dist/legacy/build/pdf" {
  export interface GlobalWorkerOptions {
    workerSrc: string;
  }
  export namespace GlobalWorkerOptions {}

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageIndex: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface TextContent {
    items: Array<{ str: string }>;
  }

  export function getDocument(
    source: string | Uint8Array | { data: ArrayBuffer }
  ): {
    promise: Promise<PDFDocumentProxy>;
  };

  export const GlobalWorkerOptions: GlobalWorkerOptions;
}

/**
 * `?url` sorgusuyla import edilen worker dosyasının
 * bize URL string olarak geldiğini TypeScript’e bildiriyoruz.
 */
declare module "pdfjs-dist/legacy/build/pdf.worker.min.js?url" {
  const workerUrl: string;
  export default workerUrl;
}