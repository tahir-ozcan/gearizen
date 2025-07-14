// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

type LoadingState = "idle" | "compress" | "extract";

export default function PdfToolkitClient() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure PDF.js worker on client once
  useEffect(() => {
    import("pdfjs-dist/legacy/build/pdf").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js";
    });
  }, []);

  /** Trigger hidden file input */
  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  /** When PDF file selected */
  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCompressedUrl(null);
    setExtractedText("");
    setError(null);
    if (!file) {
      setUploadFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
  }

  /** Compress PDF and prepare view/download URLs */
  async function handleCompressPdf() {
    if (!uploadFile) return;
    setLoading("compress");
    setError(null);
    setCompressedUrl(null);
    try {
      const buffer = await uploadFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setLoading("idle");
    }
  }

  /** Download compressed PDF */
  function handleDownloadCompressed() {
    if (!compressedUrl || !uploadFile) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${uploadFile.name}`;
    a.click();
  }

  /** View compressed PDF in new tab */
  function handleViewCompressed() {
    if (!compressedUrl) return;
    window.open(compressedUrl, "_blank");
  }

  /** Extract text and download as .doc */
  async function handleExtractText() {
    if (!uploadFile) return;
    setLoading("extract");
    setError(null);
    setExtractedText("");
    try {
      const buffer = await uploadFile.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items
          .filter((item): item is { str: string } => "str" in item)
          .map((item) => item.str);
        fullText += strings.join(" ") + "\n\n";
      }
      setExtractedText(fullText.trim());

      const blob = new Blob([fullText], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${uploadFile.name.replace(/\.pdf$/i, "")}.doc`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Text extraction failed.");
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
      {/* Başlık & Açıklama */}
      <div className="text-center space-y-4">
        <h1
          id="pdf-toolkit-heading"
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
                     text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <div className="mx-auto mt-2 h-1 w-32 rounded-full
                        bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Shrink PDF file sizes without quality loss and extract text to Word documents—
          all in-browser and offline, no signup required.
        </p>
      </div>

      {/* File Input */}
      <div className="max-w-3xl mx-auto space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUploadChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleBrowseClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                     focus:ring-2 focus:ring-blue-500 transition"
        >
          {uploadFile ? "Change PDF…" : "Browse PDF…"}
        </button>
        {uploadFile && (
          <div className="text-sm text-gray-600">
            Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Actions */}
      {uploadFile && (
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleCompressPdf}
            disabled={loading !== "idle"}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700
                       focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedUrl && (
            <>
              <button
                type="button"
                onClick={handleViewCompressed}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700
                           focus:ring-2 focus:ring-indigo-500 transition"
              >
                View Compressed
              </button>
              <button
                type="button"
                onClick={handleDownloadCompressed}
                className="px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-900
                           focus:ring-2 focus:ring-green-700 transition"
              >
                Download Compressed
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleExtractText}
            disabled={loading !== "idle"}
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700
                       focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50"
          >
            {loading === "extract" ? "Extracting…" : "Extract Text to Word"}
          </button>
        </div>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="max-w-3xl mx-auto space-y-2">
          <span className="block text-sm font-medium text-gray-800">
            Extracted Text Preview
          </span>
          <textarea
            rows={6}
            readOnly
            value={extractedText}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50
                       font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      )}
    </section>
  );
}