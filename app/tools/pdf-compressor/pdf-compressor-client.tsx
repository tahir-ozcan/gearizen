// app/tools/pdf-compressor/pdf-compressor-client.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";

export default function PdfCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // When the user selects a PDF, capture its size and reset any previous output
  useEffect(() => {
    if (!file) {
      setOriginalSize(null);
      return;
    }
    setOriginalSize(file.size);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError("");
  }, [file]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function compressPdf() {
    if (!file) return;
    setIsCompressing(true);
    setError("");
    setCompressedUrl(null);
    setCompressedSize(null);

    try {
      // Load the PDF into pdf-lib
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Save optimized (object streams enabled by default)
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

      // Create a downloadable blob URL
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setCompressedUrl(url);
      setCompressedSize(blob.size);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while compressing."
      );
    } finally {
      setIsCompressing(false);
    }
  }

  function downloadCompressed() {
    if (!compressedUrl || !file) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    const baseName = file.name.replace(/\.pdf$/i, "");
    link.download = `${baseName}.compressed.pdf`;
    link.click();
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB"];
    let idx = 0;
    let size = bytes / 1024;
    while (size >= 1024 && idx < units.length - 1) {
      size /= 1024;
      idx++;
    }
    return `${size.toFixed(2)} ${units[idx]}`;
  }

  return (
    <section
      id="pdf-compressor"
      aria-labelledby="pdf-compressor-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="pdf-compressor-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        PDF Compressor
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Reduce your PDF size in the browser—no backend or signup required.
      </p>

      {/* File selector */}
      <div className="max-w-lg mx-auto mb-6">
        <label
          htmlFor="pdf-upload"
          className="block mb-2 font-medium text-gray-800"
        >
          Select PDF File
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-white file:text-gray-700 hover:file:bg-gray-50 transition"
        />
      </div>

      {/* Show original size */}
      {originalSize !== null && (
        <p className="text-center text-gray-700 mb-4">
          Original Size: {formatBytes(originalSize)}
        </p>
      )}

      {/* Compress button */}
      <div className="text-center mb-8">
        <button
          onClick={compressPdf}
          disabled={!file || isCompressing}
          className={`inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium disabled:opacity-60 ${
            isCompressing ? "cursor-not-allowed" : ""
          }`}
        >
          {isCompressing ? "Compressing…" : "Compress PDF"}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div
          role="alert"
          className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          {error}
        </div>
      )}

      {/* Download compressed PDF */}
      {compressedUrl && compressedSize !== null && (
        <div className="max-w-lg mx-auto space-y-4 text-center">
          <p className="text-gray-700">
            Compressed Size: {formatBytes(compressedSize)}
          </p>
          <button
            onClick={downloadCompressed}
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium"
          >
            Download Compressed PDF
          </button>
        </div>
      )}
    </section>
  );
}