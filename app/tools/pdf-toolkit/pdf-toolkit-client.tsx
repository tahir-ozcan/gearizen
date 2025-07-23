// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { jsPDF } from "jspdf";

// 1) Core PDF.js API + its types from the published package
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist";
import type {
  PDFDocumentProxy,
  PDFPageProxy as _PDFPageProxy,
} from "pdfjs-dist";

// 2) Build the PDF.js worker URL at runtime so the bundler picks it up
const workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// 3) The only way to get TextContent/TextItem types is from the internal types folder
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";

import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
} from "docx";

type ExtractionMode = "image" | "text";

interface PDFTextItem {
  text: string;
  transform: number[];
  fontName?: string;
}

export default function PdfToolkitClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentAction, setCurrentAction] =
    useState<"idle" | "compress" | "extract">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const [extractionMode, setExtractionMode] =
    useState<ExtractionMode>("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Point PDF.js at its worker URL
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  function handleSelectClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setErrorMessage("❌ Please select a valid PDF file.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }

  async function compressPdfAndDownload() {
    if (!selectedFile) return;
    setCurrentAction("compress");
    setErrorMessage(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await getDocument({ data }).promise;

      const writer = new jsPDF({ unit: "pt", format: "a4" });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        const jpg = canvas.toDataURL("image/jpeg", jpegQuality);
        const props = writer.getImageProperties(jpg);
        const w = writer.internal.pageSize.getWidth();
        const h = (props.height * w) / props.width;

        if (i > 1) writer.addPage();
        writer.addImage(jpg, "JPEG", 0, 0, w, h);
      }

      const blob = writer.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${selectedFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`❌ Compression error: ${msg}`);
    } finally {
      setCurrentAction("idle");
    }
  }

  async function extractPdfToWordAndDownload() {
    if (!selectedFile) return;
    setCurrentAction("extract");
    setErrorMessage(null);

    try {
      const data = await selectedFile.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await getDocument({ data }).promise;
      const paras: Paragraph[] = [];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);

        if (extractionMode === "image") {
          const vp = page.getViewport({ scale: 2 });
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;

          const png = canvas.toDataURL("image/png");
          const b64 = png.split(",")[1];
          const bytes = Uint8Array.from(atob(b64), (c) =>
            c.charCodeAt(0)
          );

          paras.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: { width: vp.width, height: vp.height },
                  type: "png",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else {
          const content: TextContent = await page.getTextContent();
          const raw = content.items as TextItem[];
          const items: PDFTextItem[] = raw.map((it) => ({
            text: it.str,
            transform: it.transform,
            fontName: it.fontName,
          }));

          // group lines
          const lines: string[] = [];
          let lastY: number | null = null;
          let buf = "";

          for (const it of items) {
            const y = Math.round(it.transform[5] || 0);
            if (lastY === null || Math.abs(y - lastY) > 5) {
              if (buf) lines.push(buf);
              buf = it.text;
              lastY = y;
            } else {
              buf += it.text;
            }
          }
          if (buf) lines.push(buf);

          // heading heuristic
          const sample = items.find((x) => x.text.trim());
          const baseFont = sample?.fontName ?? "Times New Roman";
          const sizePt = Math.round((sample?.transform[0] || 1) * 24);
          const threshold = Math.max(32, sizePt + 4);

          for (const line of lines) {
            paras.push(
              new Paragraph({
                heading: sizePt >= threshold ? HeadingLevel.HEADING_1 : undefined,
                children: [
                  new TextRun({
                    text: line,
                    font: baseFont.replace(/[^a-zA-Z ]/g, ""),
                    size: sizePt,
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

      const doc = new DocxDocument({ sections: [{ children: paras }] });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name.replace(/\.pdf$/i, ".docx");
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`❌ Conversion error: ${msg}`);
    } finally {
      setCurrentAction("idle");
    }
  }

  function handleModeChange(e: ChangeEvent<HTMLSelectElement>) {
    setExtractionMode(e.target.value as ExtractionMode);
  }

  return (
    <section id="pdf-toolkit" className="space-y-16 text-gray-900 antialiased">
      {/* Header */}
      <div className="text-center space-y-6">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Compress your PDF or convert it to Word—preserve layout as images or extract editable text, entirely client-side.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={(e: FormEvent) => e.preventDefault()} className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleSelectClick}
              disabled={currentAction !== "idle"}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
            >
              {selectedFile ? "Change PDF…" : "Select PDF…"}
            </button>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500 font-mono truncate">
                {selectedFile.name}
              </p>
            )}

            {selectedFile && (
              <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
                {extractionMode === "image" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800">
                      JPEG Quality ({Math.round(jpegQuality * 100)}%)
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={jpegQuality * 100}
                      onChange={(e) => setJpegQuality(Number(e.target.value) / 100)}
                      disabled={currentAction !== "idle"}
                      className="w-full disabled:opacity-50"
                    />
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-800">
                  Extraction Mode
                </label>
                <select
                  value={extractionMode}
                  onChange={handleModeChange}
                  disabled={currentAction !== "idle"}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition disabled:opacity-50"
                >
                  <option value="image">Embed pages as images</option>
                  <option value="text">Extract editable text</option>
                </select>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-center space-y-4">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}
            {selectedFile && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={compressPdfAndDownload}
                  disabled={currentAction !== "idle"}
                  className="flex-1 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 transition"
                >
                  {currentAction === "compress" ? "Compressing…" : "Download Compressed"}
                </button>
                <button
                  type="button"
                  onClick={extractPdfToWordAndDownload}
                  disabled={currentAction !== "idle"}
                  className="flex-1 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus-visible:ring-2 focus-visible:ring-yellow-500 transition"
                >
                  {currentAction === "extract" ? "Converting…" : "Download as Word"}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}