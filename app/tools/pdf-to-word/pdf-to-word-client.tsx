// app/tools/pdf-to-word/pdf-to-word-client.tsx
"use client";

import { useState, ChangeEvent } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { Document, Packer, Paragraph } from "docx";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.js";

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [docUrl, setDocUrl] = useState<string>("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setDocUrl("");
    setError("");
    setFile(e.target.files?.[0] ?? null);
  }

  async function convertPdf() {
    if (!file) return;
    setIsConverting(true);
    setError("");
    setDocUrl("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const paragraphs: Paragraph[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = (content.items as TextItem[])
          .map((item) => item.str)
          .join(" ");
        if (text.trim()) {
          paragraphs.push(new Paragraph(text));
          paragraphs.push(new Paragraph(""));
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setDocUrl(url);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "An unexpected error occurred during conversion."
      );
    } finally {
      setIsConverting(false);
    }
  }

  function downloadDoc() {
    if (!docUrl || !file) return;
    const a = document.createElement("a");
    a.href = docUrl;
    const base = file.name.replace(/\.pdf$/i, "");
    a.download = `${base}.docx`;
    a.click();
  }

  return (
    <section
      id="pdf-to-word"
      aria-labelledby="pdf-to-word-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="pdf-to-word-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        PDF → Word Converter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Extract text from a PDF and download it as a Word (.docx) document—
        100% client-side, no signup required.
      </p>

      <div className="max-w-lg mx-auto mb-6">
        <label
          htmlFor="pdf-to-word-upload"
          className="block mb-2 font-medium text-gray-800"
        >
          Choose PDF File
        </label>
        <input
          id="pdf-to-word-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-white hover:file:bg-gray-50 transition"
        />
      </div>

      <div className="text-center mb-8">
        <button
          onClick={convertPdf}
          disabled={!file || isConverting}
          className={`inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium disabled:opacity-60 ${
            isConverting ? "cursor-not-allowed" : ""
          }`}
        >
          {isConverting ? "Converting…" : "Convert to Word"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="max-w-lg mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          {error}
        </div>
      )}

      {docUrl && (
        <div className="max-w-lg mx-auto text-center">
          <button
            onClick={downloadDoc}
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium"
          >
            Download DOCX File
          </button>
        </div>
      )}
    </section>
  );
}