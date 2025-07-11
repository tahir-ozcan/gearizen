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
  const [quality, setQuality] = useState(0.8);

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
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      const worker = (
        await import("pdfjs-dist/legacy/build/pdf.worker.entry?url")
      ).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

      const arrayBuffer = await file.arrayBuffer();
      const srcPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const destPdf = await PDFDocument.create();

      for (let i = 1; i <= srcPdf.numPages; i++) {
        const page = await srcPdf.getPage(i);
        // pdfjs types don't expose getViewport in our minimal declarations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const viewport = (page as any).getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page as any).render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
        );
        if (!blob) throw new Error("Compression failed");
        const img = await destPdf.embedJpg(await blob.arrayBuffer());
        const pdfPage = destPdf.addPage([viewport.width, viewport.height]);
        pdfPage.drawImage(img, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const compressedBytes = await destPdf.save({ useObjectStreams: true });
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
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-brand-200 selection:text-brand-900"
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

      {/* Quality slider */}
      {file && (
        <div className="max-w-lg mx-auto mb-6">
          <label htmlFor="quality" className="block mb-2 font-medium text-gray-800">
            Quality: <span className="font-semibold">{Math.round(quality * 100)}%</span>
          </label>
          <input
            id="quality"
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Compress button */}
      <div className="text-center mb-8">
        <button
          onClick={compressPdf}
          disabled={!file || isCompressing}
          className={`inline-flex items-center px-8 py-3 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition font-medium disabled:opacity-60 ${
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