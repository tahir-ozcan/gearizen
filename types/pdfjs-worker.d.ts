// types/pdfjs-worker.d.ts
import type { PageViewport } from "pdfjs-dist/types/src/display/api";

declare module "pdfjs-dist/legacy/build/pdf" {
  export interface GlobalWorkerOptions { workerSrc: string }
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(index: number): Promise<PDFPageProxy>;
  }
  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PageViewport;
    getTextContent(): Promise<TextContent>;
    render(params: {
      canvasContext: CanvasRenderingContext2D;
      viewport: PageViewport;
    }): { promise: Promise<void> };
  }
  export interface TextItem {
    str: string;
    transform?: number[];
    fontName?: string;
  }
  export interface TextContent { items: TextItem[] }
  export function getDocument(
    source: string | Uint8Array | { data: ArrayBuffer }
  ): { promise: Promise<PDFDocumentProxy> };
  export const GlobalWorkerOptions: GlobalWorkerOptions;
}

declare module "pdfjs-dist/legacy/build/pdf.worker.min.js?url" {
  const workerUrl: string;
  export default workerUrl;
}