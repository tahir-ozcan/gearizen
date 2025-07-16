// types/pdfjs-worker.d.ts

// 1) Worker URL import’ları için ambient modül bildirimi:
declare module "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url" {
  const workerSrc: string;
  export default workerSrc;
}
declare module "pdfjs-dist/legacy/build/pdf.worker.min.js?url" {
  const workerSrc: string;
  export default workerSrc;
}

// 2) Core PDF.js API’larının tip tanımlamaları:
//    (pdfjs-dist paketi içinde types yoksa, buradan aktarabilirsiniz)
declare module "pdfjs-dist/legacy/build/pdf" {
  import {
    GlobalWorkerOptions as _G,
    getDocument as _getDocument,
    PDFDocumentProxy as _P,
    PDFPageProxy as _PP,
    TextContent as _TC,
    TextItem as _TI,
  } from "pdfjs-dist";

  export const GlobalWorkerOptions: typeof _G;
  export function getDocument(
    source: Parameters<typeof _getDocument>[0]
  ): ReturnType<typeof _getDocument>;
  export type PDFDocumentProxy = _P;
  export type PDFPageProxy = _PP;
  export type TextContent = _TC;
  export type TextItem = _TI;
}