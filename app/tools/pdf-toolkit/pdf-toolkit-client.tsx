// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { jsPDF } from "jspdf";
// Core PDF.js API (legacy build)
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
  type TextItem,
  type TextContent,
} from "pdfjs-dist/legacy/build/pdf";
// Worker bundle (URL) — artık .mjs uzantılı
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
// Official DOCX types
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
  const [currentAction, setCurrentAction] = useState<"idle" | "compress" | "extract">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jpegQuality, setJpegQuality] = useState<number>(0.8);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Point PDF.js at its worker
  useEffect(() => {
    GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  function handleSelectClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const file = event.target.files?.[0] ?? null;
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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const pdfWriter = new jsPDF({ unit: "pt", format: "a4" });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available.");

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page: PDFPageProxy = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpeg = canvas.toDataURL("image/jpeg", jpegQuality);
        const props = pdfWriter.getImageProperties(jpeg);
        const pdfWidth = pdfWriter.internal.pageSize.getWidth();
        const pdfHeight = (props.height * pdfWidth) / props.width;

        if (i > 1) pdfWriter.addPage();
        pdfWriter.addImage(jpeg, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      const blob = pdfWriter.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${selectedFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? `❌ Compression error: ${err.message}` : "❌ Compression failed."
      );
    } finally {
      setCurrentAction("idle");
    }
  }

  async function extractPdfToWordAndDownload() {
    if (!selectedFile) return;
    setCurrentAction("extract");
    setErrorMessage(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;
      const paragraphs: Paragraph[] = [];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available.");

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page: PDFPageProxy = await pdfDoc.getPage(i);

        if (extractionMode === "image") {
          const viewport = page.getViewport({ scale: 2 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;

          const png = canvas.toDataURL("image/png");
          const base64 = png.split(",")[1];
          const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

          paragraphs.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: bytes,
                  transformation: { width: viewport.width, height: viewport.height },
                  type: "png",
                }),
              ],
              spacing: { after: 200 },
            })
          );
        } else {
          const textContent: TextContent = await page.getTextContent();
          const rawItems = textContent.items as TextItem[];
          const pdfTextItems: PDFTextItem[] = rawItems.map((item) => ({
            text: item.str,
            transform: item.transform ?? [],
            fontName: item.fontName,
          }));

          // Group by vertical position to form lines
          const lines: string[] = [];
          let lastY: number | null = null;
          let buffer = "";

          for (const itm of pdfTextItems) {
            const y = Math.round(itm.transform[5] || 0);
            if (lastY === null || Math.abs(y - lastY) > 5) {
              if (buffer) lines.push(buffer);
              buffer = itm.text;
              lastY = y;
            } else {
              buffer += itm.text;
            }
          }
          if (buffer) lines.push(buffer);

          // Heading detection (basic)
          const sample = pdfTextItems.find((t) => t.text.trim());
          const baseFont = sample?.fontName ?? "Times New Roman";
          const fontSizePt = Math.round((sample?.transform[0] ?? 1) * 24);
          const headingThreshold = Math.max(32, fontSizePt + 4);

          for (const line of lines) {
            const isHeading = fontSizePt >= headingThreshold;
            paragraphs.push(
              new Paragraph({
                heading: isHeading ? HeadingLevel.HEADING_1 : undefined,
                children: [
                  new TextRun({
                    text: line,
                    font: baseFont.replace(/[^a-zA-Z ]/g, ""),
                    size: fontSizePt,
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

      const wordDoc = new DocxDocument({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(wordDoc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name.replace(/\.pdf$/i, ".docx");
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? `❌ Conversion error: ${err.message}` : "❌ Conversion failed."
      );
    } finally {
      setCurrentAction("idle");
    }
  }

  function handleModeChange(event: ChangeEvent<HTMLSelectElement>) {
    setExtractionMode(event.target.value as ExtractionMode);
  }

  return (
    <section id="pdf-toolkit" className="space-y-16 text-gray-900 antialiased">
      {/* Header */}
      <div className="text-center space-y-6 sm:px-0">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Compress your PDF or convert it to Word—preserve layout as images or extract editable text,
          entirely client-side.
        </p>
      </div>

      <form
        onSubmit={(e: FormEvent) => e.preventDefault()}
        className="max-w-3xl mx-auto space-y-8 sm:px-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleSelectClick}
                disabled={currentAction !== "idle"}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
              >
                {selectedFile ? "Change PDF…" : "Select PDF…"}
              </button>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-500 font-mono truncate">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {selectedFile && (
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                {extractionMode === "image" && (
                  <div className="space-y-2">
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
                      disabled={currentAction === "extract"}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-800">
                    Extraction Mode
                  </label>
                  <select
                    value={extractionMode}
                    onChange={handleModeChange}
                    disabled={currentAction === "extract"}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="image">Embed pages as images</option>
                    <option value="text">Extract editable text</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}
            {selectedFile && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={compressPdfAndDownload}
                  disabled={currentAction !== "idle"}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium"
                >
                  {currentAction === "compress" ? "Compressing…" : "Download Compressed"}
                </button>

                <button
                  type="button"
                  onClick={extractPdfToWordAndDownload}
                  disabled={currentAction !== "idle"}
                  className="flex items-center px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition font-medium"
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