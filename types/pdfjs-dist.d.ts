// types/pdfjs-dist.d.ts

/**
 * Minimal TypeScript declarations for the legacy PDF.js build.
 * You import these from "pdfjs-dist/legacy/build/pdf" and its worker entry.
 */

declare module "pdfjs-dist/legacy/build/pdf" {
  /** Loaded PDF document proxy. */
  export interface PDFDocumentProxy {
    /** Total number of pages in the document. */
    numPages: number;
    /**
     * Load the given page number (1-based) and return a page proxy.
     * @param pageNumber Page number to load.
     */
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  /** Single page proxy from PDFDocumentProxy.getPage. */
  export interface PDFPageProxy {
    /**
     * Extracts the text content of the page.
     * The result contains an array of text items and optional styles map.
     */
    getTextContent(): Promise<TextContent>;
  }

  /** The result of .getTextContent(), containing text items and optional style definitions. */
  export interface TextContent {
    /** Individual text runs on the page. */
    items: TextItem[];
    /**
     * Optional map of style IDs to style definitions.
     * You only need this if you care about font metrics or styling.
     */
    styles?: Record<string, TextStyle>;
  }

  /** A single run of text on a PDF page. */
  export interface TextItem {
    /** The actual UTF-8 string. */
    str: string;
    /** 6-element transform matrix [a, b, c, d, e, f]. */
    transform?: number[];
    /** Width of the rendered text run. */
    width?: number;
    /** Height of the rendered text run. */
    height?: number;
    /** Writing direction ("ltr", "rtl", etc.). */
    dir?: string;
    /** Font name key, matching an entry in TextContent.styles. */
    fontName?: string;
  }

  /** Style object for a TextItem, keyed by style‐ID in TextContent.styles */
  export interface TextStyle {
    /** CSS font-family, e.g. "Calibri, sans-serif" */
    fontFamily: string;
    /** CSS font-size in points */
    fontSize: number;
    /** Ascent metric for baseline alignment */
    ascent?: number;
    /** Descent metric for baseline alignment */
    descent?: number;
    /** Other numeric or string style properties if present */
    [prop: string]: string | number | undefined;
  }

  /**
   * Global PDF.js worker configuration.
   * You must set `.workerSrc` before calling getDocument().
   */
  export const GlobalWorkerOptions: {
    /** URL to the pdf.worker.min.js bundle at runtime */
    workerSrc: string;
    /** PDF.js version string (e.g. "2.11.338") */
    version: string;
  };

  /**
   * Kick off loading a PDF. Accepts a URL string, typed array, or `{ data: ArrayBuffer }`.
   * Returns an object whose `.promise` resolves with PDFDocumentProxy.
   */
  export function getDocument(
    source: string | Uint8Array | { data: ArrayBuffer }
  ): { promise: Promise<PDFDocumentProxy> };
}

/** The companion worker entrypoint. */
declare module "pdfjs-dist/legacy/build/pdf.worker.entry";
declare module "pdfjs-dist/legacy/build/pdf.worker.entry?url";