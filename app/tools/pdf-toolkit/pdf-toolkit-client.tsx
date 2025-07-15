// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { jsPDF } from "jspdf";
// PDF.js runtime
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
  type TextContent,
} from "pdfjs-dist/legacy/build/pdf";
// Docx
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
} from "docx";

type ExtractMode = "image" | "text";

// Minimal local type for text‐content items
interface PDFTextItem {
  str: string;
  transform: [number, number, number, number, number, number];
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

  // PDF.js worker setup
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
          // @ts-expect-error render exists
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

  /** Extract to Word—either as images or as real text */
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
          // image‐based
          // @ts-expect-error getViewport exists at runtime
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // @ts-expect-error render exists
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
          // text‐based
          const textContent: TextContent = await page.getTextContent();
          const items = textContent.items as PDFTextItem[];
          const lines: string[] = [];
          let currentLine = "";
          let lastY: number | null = null;

          items.forEach((item) => {
            const y = Math.round(item.transform[5]);
            if (lastY === null) {
              lastY = y;
            } else if (Math.abs(y - lastY) > 5) {
              lines.push(currentLine);
              currentLine = item.str;
              lastY = y;
              return;
            }
            currentLine += item.str;
          });
          if (currentLine) lines.push(currentLine);

          lines.forEach((text) => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text,
                    font: "Times New Roman",
                    size: 24, // 12pt
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          });
        }
      }

      const doc = new DocxDocument({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
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
    <section id="pdf-toolkit" className="px-4 py-16 max-w-4xl mx-auto space-y-12">
      {/* Heading */}
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">
          PDF Toolkit: Compress & Convert
        </h1>
        <p className="text-gray-700 text-lg">
          Shrink PDF sizes or turn them into Word documents—either exact images or editable text—100% in-browser, no signup.
        </p>
      </header>

      {/* File Selection */}
      <div className="flex flex-col items-center space-y-3">
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        <button
          onClick={handleSelectClick}
          disabled={loading !== "idle"}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {file ? "Change PDF…" : "Select PDF…"}
        </button>
        {file && (
          <p className="text-gray-600 text-sm font-mono truncate">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Options */}
      {file && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* JPEG Quality */}
          <div>
            <label className="block text-gray-800 mb-1">
              JPEG Quality: <span className="font-semibold">{Math.round(jpegQuality * 100)}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={jpegQuality * 100}
              onChange={(e) => setJpegQuality(+e.target.value / 100)}
              className="w-full"
            />
          </div>

          {/* Extraction Mode */}
          <div>
            <label className="block text-gray-800 mb-1">Extraction Mode:</label>
            <select
              value={extractMode}
              onChange={handleModeChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="image">Embed pages as images</option>
              <option value="text">Extract editable text</option>
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}

      {/* Actions */}
      {file && (
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleCompress}
            disabled={loading !== "idle"}
            className="px-8 py-3 bg-green-600 text-white rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedBlob && (
            <button
              onClick={handleDownloadCompressed}
              className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-100 transition-opacity"
            >
              Download Compressed
            </button>
          )}

          <button
            onClick={handleExtractToWord}
            disabled={loading !== "idle"}
            className="px-8 py-3 bg-yellow-600 text-white rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "extract" ? "Converting…" : "Extract to Word"}
          </button>
        </div>
      )}
    </section>
  );
}