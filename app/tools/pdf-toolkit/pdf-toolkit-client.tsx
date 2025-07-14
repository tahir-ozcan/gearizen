// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";

/**
 * PDF Toolkit: Compress & Convert
 *
 * Shrink PDF file sizes without quality loss and extract text to Word documents—
 * all in-browser and offline, no signup required.
 */
export default function PdfToolkitClient() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"idle" | "compress" | "extract">("idle");
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  /** PDF dosyası seçildiğinde */
  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      setUploadFile(null);
      return;
    }
    setError(null);
    setExtractedText("");
    setUploadFile(file);
  }

  /** PDF’i sıkıştır ve indir */
  async function handleCompressPdf() {
    if (!uploadFile) return;
    setLoading("compress");
    setError(null);
    try {
      const buffer = await uploadFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${uploadFile.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setLoading("idle");
    }
  }

  /** PDF’ten metni çıkar ve .doc olarak indir */
  async function handleExtractText() {
    if (!uploadFile) return;
    setLoading("extract");
    setError(null);
    try {
      const buffer = await uploadFile.arrayBuffer();
      // dinamik import, sadece tarayıcıda
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items
          .filter((item): item is { str: string } => "str" in item)
          .map(item => item.str);
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
          Shrink PDF file sizes without quality loss and extract text to Word documents—all in-browser and offline, no signup required.
        </p>
      </div>

      {/* PDF Yükleme ve İşlemler */}
      <div className="max-w-3xl mx-auto space-y-8">
        <label className="block text-sm font-medium text-gray-800">
          Select a PDF file
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUploadChange}
            className="mt-1 block w-full text-sm text-gray-700"
          />
        </label>

        {uploadFile && (
          <div className="text-sm text-gray-600">
            Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* İşlem Butonları */}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleCompressPdf}
            disabled={!uploadFile || loading !== "idle"}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700
                       focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
          >
            {loading === "compress" ? "Compressing…" : "Compress PDF"}
          </button>
          <button
            type="button"
            onClick={handleExtractText}
            disabled={!uploadFile || loading !== "idle"}
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700
                       focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50"
          >
            {loading === "extract" ? "Extracting…" : "Extract Text to Word"}
          </button>
        </div>

        {/* Extracted Text Önizleme */}
        {extractedText && (
          <div className="space-y-2">
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
      </div>
    </section>
  );
}