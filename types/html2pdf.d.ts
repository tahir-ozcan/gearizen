// types/html2pdf.d.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * html2pdf.js — client-side HTML → PDF converter
 * This module doesn’t ship its own TS types, so we declare the default export as `any`.
 * You can import it like:
 *    import html2pdf from "html2pdf.js";
 */
declare module "html2pdf.js" {
  const html2pdf: any;
  export default html2pdf;
}

declare module "html2pdf.js/dist/html2pdf.es.js" {
  const html2pdf: any;
  export default html2pdf;
}