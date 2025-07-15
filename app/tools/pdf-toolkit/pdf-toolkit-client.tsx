// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { jsPDF } from "jspdf";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf";
import type { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
} from "docx";

type ExtractMode = "image" | "text";

interface PDFTextItem {
  str: string;
  transform: number[];
  fontName?: string;
}

export default function PdfToolkitClient() {
  // ─── State ───────────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [jpegQuality, setJpegQuality] = useState(0.8);
  const [extractMode, setExtractMode] = useState<ExtractMode>("image");
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── PDF.js worker configuration ─────────────────────────────────────────
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function handleSelectClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setCompressedBlob(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (f.type !== "application/pdf") {
      setError("❌ Please select a valid PDF file.");
      setFile(null);
    } else {
      setFile(f);
    }
  }

  async function handleCompress() {
    if (!file) return;
    setLoading("compress");
    setError(null);
    setCompressedBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Gizli canvas oluştur
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);
        // @ts-expect-error viewport runtime
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        if (ctx) {
          // @ts-expect-error render runtime
          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        }
        const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
        const props = doc.getImageProperties(dataUrl);
        const pw = doc.internal.pageSize.getWidth();
        const ph = (props.height * pw) / props.width;
        if (i > 1) doc.addPage();
        doc.addImage(dataUrl, "JPEG", 0, 0, pw, ph);
      }

      const blob = doc.output("blob");
      setCompressedBlob(blob);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "❌ Compression failed.");
    } finally {
      setLoading("idle");
    }
  }

  function handleDownloadCompressed() {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleExtractToWord() {
    if (!file) return;
    setLoading("extract");
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const children: Paragraph[] = [];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const reader = new FileReader();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);

        if (extractMode === "image") {
          // Görsel mod
          // @ts-expect-error viewport runtime
          const viewport = page.getViewport({ scale: 2 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          if (ctx) {
            // @ts-expect-error render runtime
            const renderTask = page.render({ canvasContext: ctx, viewport });
            await renderTask.promise;
          }
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.split(",")[1];
          const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: { width: viewport.width, height: viewport.height },
                  type: "png",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else {
          // Metin modu
          const textContent = (await page.getTextContent()) as TextContent;
          const raw = textContent.items as (TextItem | TextMarkedContent)[];
          const textItems: TextItem[] = raw.filter((it): it is TextItem => Boolean((it as TextItem).str));
          const items: PDFTextItem[] = textItems.map(it => ({
            str: it.str,
            transform: it.transform,
            fontName: it.fontName,
          }));

          // Satır birleştirme
          const lines: string[] = [];
          let acc = "", lastY: number | null = null;
          for (const itm of items) {
            const y = Math.round(itm.transform[5]);
            if (lastY === null || Math.abs(y - lastY) > 5) {
              if (acc) lines.push(acc);
              acc = itm.str;
              lastY = y;
            } else {
              acc += itm.str;
            }
          }
          if (acc) lines.push(acc);

          // Font/ölçek örneklemesi
          const sample = items.find(it => it.str.trim());
          const baseFont = sample?.fontName ?? "Times New Roman";
          const halfPt = Math.round((sample?.transform[0] ?? 1) * 24);
          const headingThreshold = Math.max(32, halfPt + 4);

          for (const txt of lines) {
            const isHeading = halfPt >= headingThreshold;
            children.push(
              new Paragraph({
                heading: isHeading ? HeadingLevel.HEADING_1 : undefined,
                children: [
                  new TextRun({
                    text: txt,
                    font: baseFont.replace(/[^a-zA-Z ]/g, ""),
                    size: halfPt,
                    bold: baseFont.toLowerCase().includes("bold"),
                    italics: baseFont.toLowerCase().includes("italic"),
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }
      }

      // DOCX oluştur ve indir
      const docx = new DocxDocument({ sections: [{ children }] });
      const blob = await Packer.toBlob(docx);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "❌ Conversion to Word failed.");
    } finally {
      setLoading("idle");
    }
  }

  function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
    setExtractMode(e.target.value as ExtractMode);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="pdf-toolkit" className="space-y-16 text-gray-900 antialiased">
      {/* Başlık & Açıklama */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Compress PDF or convert to Word—preserve layout as images or extract editable text, entirely client-side.
        </p>
      </div>

      <form onSubmit={(e: FormEvent) => e.preventDefault()} className="max-w-3xl mx-auto space-y-8 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sol sütun: Dosya & Ayarlar */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center">
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleSelectClick}
                disabled={loading !== "idle"}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
              >
                {file ? "Change PDF…" : "Select PDF…"}
              </button>
              {file && (
                <p className="mt-2 text-sm text-gray-500 font-mono truncate">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {file && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {extractMode === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      JPEG Quality
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={jpegQuality * 100}
                      onChange={e => setJpegQuality(Number(e.target.value) / 100)}
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {Math.round(jpegQuality * 100)}%
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Extraction Mode
                  </label>
                  <select
                    value={extractMode}
                    onChange={handleModeChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                  >
                    <option value="image">Embed pages as images</option>
                    <option value="text">Extract editable text</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sağ sütun: Hata & Butonlar */}
          <div className="flex flex-col justify-between">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {file && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleCompress}
                  disabled={loading !== "idle"}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium"
                >
                  {loading === "compress" ? "Compressing…" : "Compress PDF"}
                </button>
                {compressedBlob && (
                  <button
                    type="button"
                    onClick={handleDownloadCompressed}
                    className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition font-medium"
                  >
                    Download Compressed
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExtractToWord}
                  disabled={loading !== "idle"}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition font-medium"
                >
                  {loading === "extract" ? "Converting…" : "Download as Word"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}