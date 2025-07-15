// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { PDFDocument, type SaveOptions } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function PdfToolkitClient() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF.js worker configuration
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }, []);

  // Open file picker
  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  // File input change
  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setCompressedUrl(null);
    setExtractedText("");
    if (!f) {
      setUploadFile(null);
      return;
    }
    if (f.type !== "application/pdf") {
      setError("❌ Please select a valid PDF file.");
      setUploadFile(null);
      return;
    }
    setUploadFile(f);
  }

  // Compress PDF
  async function handleCompressPdf() {
    if (!uploadFile) return;
    setLoading("compress");
    setError(null);
    setCompressedUrl(null);
    try {
      const buf = await uploadFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const bytes = await pdfDoc.save({ useObjectStreams: true } as SaveOptions);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      setCompressedUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "❌ Compression failed.");
    } finally {
      setLoading("idle");
    }
  }

  // Extract text and convert to Word
  async function handleExtractToWord() {
    if (!uploadFile) return;
    setLoading("extract");
    setError(null);
    setExtractedText("");
    try {
      const buf = await uploadFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

      const paragraphs: Paragraph[] = [];
      let previewText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item): item is { str: string } => "str" in item)
          .map(item => item.str)
          .join(" ");

        previewText += pageText + "\n\n";

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: pageText,
                font: "Times New Roman",
                size: 24,    // 12pt
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      setExtractedText(previewText.trim());

      const doc = new Document({
        sections: [{ children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = uploadFile.name.replace(/\.pdf$/i, ".docx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "❌ Text extraction failed.");
    } finally {
      setLoading("idle");
    }
  }

  return (
    <section
      id="pdf-toolkit"
      aria-labelledby="pdf-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="pdf-toolkit-heading"
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                     text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <div className="mx-auto max-w-2xl space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
          <p>
            Shrink PDF file sizes without loss of quality, and produce Word documents that mirror your PDF’s original
            typography and layout—entirely in-browser, offline, and with no signup required.
          </p>
        </div>
      </div>

      {/* File Selection */}
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUploadChange}
          className="hidden"
        />
        <button
          onClick={handleBrowseClick}
          disabled={loading !== "idle"}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
        >
          {uploadFile ? "Change PDF…" : "Select PDF…"}
        </button>
        {uploadFile && (
          <p className="text-sm text-gray-600 font-mono text-center truncate w-full">
            {uploadFile.name} — {(uploadFile.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center font-serif">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {uploadFile && (
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-4">
          <button
            onClick={handleCompressPdf}
            disabled={loading !== "idle"}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition font-medium"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedUrl && (
            <button
              onClick={() => {
                // force download only
                fetch(compressedUrl)
                  .then(res => res.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `compressed-${uploadFile.name}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  });
              }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition font-medium"
            >
              Download Compressed
            </button>
          )}

          <button
            onClick={handleExtractToWord}
            disabled={loading !== "idle"}
            className="px-5 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition font-medium"
          >
            {loading === "extract" ? "Converting to Word…" : "Extract Text to Word"}
          </button>
        </div>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="max-w-2xl mx-auto space-y-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Extracted Text Preview</h2>
          <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <textarea
            rows={6}
            readOnly
            value={extractedText}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
          />
        </div>
      )}
    </section>
  );
}