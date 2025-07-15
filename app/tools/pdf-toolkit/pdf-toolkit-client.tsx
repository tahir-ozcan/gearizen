// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { jsPDF } from "jspdf";
// PDF.js runtime & types
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf";
import type { TextContent, TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
// Docx
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
} from "docx";

type ExtractMode = "image" | "text";

// PDF.js getTextContent().items listesinden aldığımız minimal yapı
interface PDFTextItem {
  str: string;
  transform: number[];
  fontName?: string;
}

export default function PdfToolkitClient() {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [jpegQuality, setJpegQuality] = useState(0.8);
  const [extractMode, setExtractMode] = useState<ExtractMode>("image");
  const inputRef = useRef<HTMLInputElement>(null);

  // PDF.js worker
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }, []);

  // --- Handlers ---

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
      return;
    }
    setFile(f);
  }

  /** Compress by rasterizing pages to JPEG & rebuilding PDF */
  async function handleCompress() {
    if (!file) return;
    setLoading("compress");
    setError(null);
    setCompressedBlob(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);
        // @ts-expect-error getViewport exists at runtime
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // @ts-expect-error render exists at runtime
          const renderTask = page.render({ canvasContext: ctx, viewport });
          await renderTask.promise;
        }
        const imgData = canvas.toDataURL("image/jpeg", jpegQuality);
        const props = doc.getImageProperties(imgData);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = (props.height * pageWidth) / props.width;
        if (i > 1) doc.addPage();
        doc.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
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

  /** Trigger download only, do not open new tab */
  function handleDownloadCompressed() {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** Convert pages to Word—image or true text mode */
  async function handleExtractToWord() {
    if (!file) return;
    setLoading("extract");
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const children: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page: PDFPageProxy = await pdf.getPage(i);

        if (extractMode === "image") {
          // page as image
          // @ts-expect-error getViewport exists at runtime
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // @ts-expect-error render exists at runtime
            const renderTask = page.render({ canvasContext: ctx, viewport });
            await renderTask.promise;
          }
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.split(",")[1];
          const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

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
          // real text extraction
          const textContent = (await page.getTextContent()) as TextContent;
          // only TextItem’ları alın
          const raw = textContent.items as (TextItem | TextMarkedContent)[];
          const textItems: TextItem[] = raw.filter(
            (it): it is TextItem => (it as TextItem).str !== undefined
          );

          // PDFTextItem[]’e çevir
          const items: PDFTextItem[] = textItems.map((it) => ({
            str: it.str,
            transform: it.transform,
            fontName: it.fontName,
          }));

          // satırları yeniden birleştir
          const lines: string[] = [];
          let currentLine = "";
          let lastY: number | null = null;
          for (const item of items) {
            const y = Math.round(item.transform[5]);
            if (lastY === null) {
              lastY = y;
              currentLine = item.str;
            } else if (Math.abs(y - lastY) > 5) {
              lines.push(currentLine);
              currentLine = item.str;
              lastY = y;
            } else {
              currentLine += item.str;
            }
          }
          if (currentLine) lines.push(currentLine);

          // örnek font ve boyut bul
          const sample = items.find((it) => it.str.trim().length > 0);
          const baseFont = sample?.fontName ?? "Times New Roman";
          const baseScale = sample ? sample.transform[0] : 1;
          const computedSize = Math.max(16, Math.round(baseScale * 24)); // half-point

          for (const txt of lines) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: txt,
                    font: baseFont.replace(/[^a-zA-Z ]/g, ""),
                    size: computedSize,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }
      }

      const docx = new DocxDocument({ sections: [{ children }] });
      const blob = await Packer.toBlob(docx);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  return (
    <section id="pdf-toolkit" className="px-4 py-16 max-w-3xl mx-auto space-y-12">
      {/* Başlık */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <p className="text-gray-600">
          Compress PDF files or convert them to Word—preserve layout as images or extract editable text, entirely in-browser.
        </p>
      </header>

      {/* Dosya Seçimi */}
      <div className="flex flex-col items-center space-y-2">
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        <button
          onClick={handleSelectClick}
          disabled={loading !== "idle"}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {file ? "Change PDF…" : "Select PDF…"}
        </button>
        {file && (
          <p className="text-sm text-gray-500 font-mono truncate">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Ayarlar */}
      {file && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {extractMode === "image" && (
            <div>
              <label className="block text-gray-700 mb-1">
                JPEG Quality: <span className="font-semibold">{Math.round(jpegQuality * 100)}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={jpegQuality * 100}
                onChange={(e) => setJpegQuality(Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1">Extraction Mode:</label>
            <select
              value={extractMode}
              onChange={handleModeChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="image">Embed pages as images</option>
              <option value="text">Extract editable text</option>
            </select>
          </div>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}

      {/* Butonlar */}
      {file && (
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleCompress}
            disabled={loading !== "idle"}
            className="px-6 py-2 bg-green-600 text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedBlob && (
            <button
              onClick={handleDownloadCompressed}
              className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition-opacity"
            >
              Download Compressed
            </button>
          )}

          <button
            onClick={handleExtractToWord}
            disabled={loading !== "idle"}
            className="px-6 py-2 bg-yellow-600 text-white rounded hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "extract" ? "Converting…" : "Extract to Word"}
          </button>
        </div>
      )}
    </section>
  );
}