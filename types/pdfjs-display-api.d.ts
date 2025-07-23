// types/pdfjs-display-api.d.ts
import type {
  TextMarkedContent,
  TextItem as PDTextItem,
} from "pdfjs-dist/types/src/display/api"; // pull in the original union

declare module "pdfjs-dist/types/src/display/api" {
  /**  
   * Extend the original TextItem from pdfjs-dist to use a loose transform  
   * and carry any other properties.  
   */
  export interface TextItem extends PDTextItem {
    /** PDF.js actually returns a variable‑length number[] transform */
    transform: number[];
  }

  /**  
   * Mirror the real TextContent but restrict items to TextItem | TextMarkedContent  
   */
  export interface TextContent {
    items: (TextItem | TextMarkedContent)[];
    styles: { [fontName: string]: any };
  }
}