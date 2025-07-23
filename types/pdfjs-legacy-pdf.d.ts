// types/pdfjs-legacy-build-pdf.d.ts
import type {
  GlobalWorkerOptions as _GWO,
  getDocument as _GD,
  PDFDocumentProxy as _DP,
  PDFPageProxy as _PP,
  TextContent as _TC,
  TextItem as _TI,
} from "pdfjs-dist";

declare module "pdfjs-dist/legacy/build/pdf" {
  export const GlobalWorkerOptions: typeof _GWO;
  export function getDocument(src: Parameters<typeof _GD>[0]): ReturnType<typeof _GD>;
  export type PDFDocumentProxy = _DP;
  export type PDFPageProxy = _PP;
  export type TextContent = _TC;
  export type TextItem = _TI;
}