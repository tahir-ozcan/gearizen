// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { PDFDocument, type SaveOptions } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";

export default function PdfToolkitClient() {
  // --- State ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- PDF.js worker setup ---
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
    setExtractedText("");
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

  async function handleCompress() {
    if (!file) return;
    setLoading("compress");
    setError(null);
    setCompressedBlob(null);
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const bytes = await pdfDoc.save({ useObjectStreams: true } as SaveOptions);
      const blob = new Blob([bytes], { type: "application/pdf" });
      setCompressedBlob(blob);
    } catch (err: unknown) {
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
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleExtractToWord() {
    if (!file) return;
    setLoading("extract");
    setError(null);
    setExtractedText("");
    try {
      const buf = await file.arrayBuffer();
      const pdf = await getDocument({ data: buf }).promise;
      const paragraphs: Paragraph[] = [];
      let preview = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const textItems = content.items
          .filter((item): item is { str: string } => "str" in item)
          .map((item) => item.str);
        const pageText = textItems.join(" ");
        preview += pageText + "\n\n";
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: pageText, font: "Times New Roman", size: 24 }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      setExtractedText(preview.trim());

      const doc = new Document({ sections: [{ children: paragraphs }] });
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
      setError(err instanceof Error ? err.message : "❌ Text extraction failed.");
    } finally {
      setLoading("idle");
    }
  }

  return (
    <section id="pdf-toolkit" aria-labelledby="pdf-toolkit-heading" className="space-y-16 text-gray-900 antialiased">
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="pdf-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700">
          Shrink PDF file sizes without quality loss, and extract text to Word documents—entirely in-browser, offline, 100% client-side, no signup.
        </p>
      </div>

      {/* File Selector */}
      <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleSelectClick}
          disabled={loading !== "idle"}
          className="
            inline-block
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-white font-medium
            px-6 py-3 rounded-full
            transition transform hover:scale-105 disabled:opacity-50
          "
        >
          {file ? "Change PDF…" : "Select PDF…"}
        </button>
        {file && (
          <p className="text-sm text-gray-600 font-mono truncate w-full text-center">
            {file.name} — {(file.size / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      {file && (
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-4">
          <button
            onClick={handleCompress}
            disabled={loading !== "idle"}
            className="
              inline-block
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white font-medium
              px-6 py-3 rounded-full
              transition transform hover:scale-105 disabled:opacity-50
            "
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedBlob && (
            <button
              onClick={handleDownloadCompressed}
              className="
                inline-block
                border border-indigo-500 text-indigo-500 font-medium
                px-6 py-3 rounded-full
                transition hover:bg-indigo-50
              "
            >
              Download Compressed
            </button>
          )}

          <button
            onClick={handleExtractToWord}
            disabled={loading !== "idle"}
            className="
              inline-block
              bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
              text-white font-medium
              px-6 py-3 rounded-full
              transition transform hover:scale-105 disabled:opacity-50
            "
          >
            {loading === "extract" ? "Converting…" : "Extract Text to Word"}
          </button>
        </div>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="max-w-2xl mx-auto space-y-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Extracted Text Preview</h2>
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
          <textarea
            rows={6}
            readOnly
            value={extractedText}
            className="
              w-full p-3 border border-gray-300 rounded-md
              bg-gray-50 font-mono text-sm resize-y
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              transition
            "
          />
        </div>
      )}
    </section>
  );
}