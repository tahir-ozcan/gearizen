// types/pdfjs-worker.d.ts

// 1) PDF.js worker entry için ambient modül bildirimi:
declare module "pdfjs-dist/build/pdf.worker.entry" {
  const workerSrc: string;
  export default workerSrc;
}

// 2) Eğer Core API tiplerini override etmek isterseniz
// Bunlar genelde pdfjs-dist içinde hazır gelir; gerekmedikçe silebilirsiniz.
declare module "pdfjs-dist/legacy/build/pdf" {
  export * from "pdfjs-dist";
}