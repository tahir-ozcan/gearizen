// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { PDFDocument, type SaveOptions } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// webpack will emit this worker file as an asset per your next.config.ts rule:
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";

type LoadingState = "idle" | "compress" | "extract";

export default function PdfToolkitClient() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wire up PDF.js's worker to the emitted URL
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  }, []);

  function handleBrowseClick() {
    fileInputRef.current?.click();
  }

  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);
    setCompressedUrl(null);
    setExtractedText("");

    if (!file) {
      setUploadFile(null);
    } else if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      setUploadFile(null);
    } else {
      setUploadFile(file);
    }
  }

  async function handleCompressPdf() {
    if (!uploadFile) return;
    setLoading("compress");
    setError(null);
    setCompressedUrl(null);

    try {
      const buffer = await uploadFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const bytes = await pdfDoc.save({ useObjectStreams: true } as SaveOptions);
      const blob = new Blob([bytes], { type: "application/pdf" });
      setCompressedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setLoading("idle");
    }
  }

  function handleViewCompressed() {
    if (compressedUrl) window.open(compressedUrl, "_blank");
  }

  function handleDownloadCompressed() {
    if (!compressedUrl || !uploadFile) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed-${uploadFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(compressedUrl), 1000);
  }

  async function handleExtractText() {
    if (!uploadFile) return;
    setLoading("extract");
    setError(null);
    setExtractedText("");

    try {
      const buffer = await uploadFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((itm) => itm.str);
        fullText += strings.join(" ") + "\n\n";
      }

      setExtractedText(fullText.trim());

      // download as Word doc
      const blob = new Blob([fullText], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${uploadFile.name.replace(/\.pdf$/i, "")}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Text extraction failed.");
    } finally {
      setLoading("idle");
    }
  }

  return (
    <section className="space-y-12 text-gray-900 antialiased px-4 md:px-0">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]">
          PDF Toolkit: Compress &amp; Convert
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Shrink PDF file sizes without quality loss and extract text to Word documents—all in-browser
          and offline, no signup required.
        </p>
      </div>

      {/* File chooser */}
      <div className="max-w-md mx-auto flex flex-col items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUploadChange}
          className="hidden"
        />
        <button
          onClick={handleBrowseClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
        >
          {uploadFile ? "Change PDF…" : "Browse PDF…"}
        </button>
        {uploadFile && (
          <div className="text-sm text-gray-600 truncate w-full text-center">
            {uploadFile.name} — {(uploadFile.size / 1024).toFixed(1)} KB
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Actions */}
      {uploadFile && (
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-3">
          <button
            onClick={handleCompressPdf}
            disabled={loading !== "idle"}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>

          {compressedUrl && (
            <>
              <button
                onClick={handleViewCompressed}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition"
              >
                View Compressed
              </button>
              <button
                onClick={handleDownloadCompressed}
                className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 focus:ring-2 focus:ring-green-700 transition"
              >
                Download Compressed
              </button>
            </>
          )}

          <button
            onClick={handleExtractText}
            disabled={loading !== "idle"}
            className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50"
          >
            {loading === "extract" ? "Extracting…" : "Extract Text to Word"}
          </button>
        </div>
      )}

      {/* Preview */}
      {extractedText && (
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-lg font-medium text-gray-800">Extracted Text Preview</h2>
          <textarea
            rows={6}
            readOnly
            value={extractedText}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      )}
    </section>
  );
}