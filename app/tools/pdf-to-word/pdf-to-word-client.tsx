// app/tools/pdf-to-word/pdf-to-word-client.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import PreviewImage from "@/components/PreviewImage";
import { pdfToWord } from "@/lib/pdf-to-word";

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewSize, setPreviewSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [numPages, setNumPages] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [method, setMethod] = useState<'text' | 'image'>("text");
  const [pageBreaks, setPageBreaks] = useState(true);
  const [outputName, setOutputName] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDocUrl("");
    setError(null);
    setPreviewUrl("");
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setOutputName(f.name.replace(/\.pdf$/i, ""));
    }
  };

  const readFileAsArrayBuffer = (file: File) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsArrayBuffer(file);
    });

  const convertPdf = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    setDocUrl("");
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const blob = await pdfToWord(arrayBuffer, {
        startPage,
        endPage,
        method,
        pageBreaks,
      });
      const data = blob instanceof Blob ? blob : new Blob([blob]);
      const url = URL.createObjectURL(data);
      setDocUrl(url);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "An error occurred during conversion."
      );
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const arrayBuffer = await readFileAsArrayBuffer(file);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true } as any).promise;
        setNumPages(pdf.numPages);
        setStartPage(1);
        setEndPage(pdf.numPages);
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        setPreviewUrl(canvas.toDataURL());
        setPreviewSize({ w: canvas.width, h: canvas.height });
      } catch {
        // ignore errors during preview generation
      }
    })();
  }, [file]);

  const downloadDoc = () => {
    if (!docUrl || !file) return;
    const a = document.createElement("a");
    a.href = docUrl;
    const base = outputName || file.name.replace(/\.pdf$/i, "");
    a.download = base + ".docx";
    a.click();
    URL.revokeObjectURL(docUrl);
  };

  return (
    <section
      id="pdf-to-word"
      aria-labelledby="pdf-to-word-heading"
      className="container-responsive py-20 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="pdf-to-word-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        PDF to Word Converter
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        Upload a PDF and convert its text to a Word document—all right in your browser.
      </p>

      <div className="max-w-lg mx-auto mb-6">
        <label htmlFor="pdf-upload" className="block mb-2 font-medium text-gray-800">
          Choose PDF File
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-white hover:file:bg-gray-50 transition"
        />
      </div>

      {previewUrl && previewSize && (
        <div className="max-w-lg mx-auto mb-6 text-center">
          <PreviewImage
            src={previewUrl}
            alt="PDF preview"
            width={previewSize.w}
            height={previewSize.h}
          />
        </div>
      )}

      {numPages > 0 && (
        <div className="max-w-lg mx-auto grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="start-page" className="block mb-1 font-medium text-gray-800">
              Start Page
            </label>
            <input
              id="start-page"
              type="number"
              min={1}
              max={numPages}
              value={startPage}
              onChange={(e) => setStartPage(Math.max(1, Math.min(numPages, Number(e.target.value))))}
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="end-page" className="block mb-1 font-medium text-gray-800">
              End Page
            </label>
            <input
              id="end-page"
              type="number"
              min={startPage}
              max={numPages}
              value={endPage}
              onChange={(e) => setEndPage(Math.max(startPage, Math.min(numPages, Number(e.target.value))))}
              className="input-base"
            />
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto mb-6">
        <label htmlFor="method" className="block mb-1 font-medium text-gray-800">
          Conversion Method
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value as 'text' | 'image')}
          className="input-base"
        >
          <option value="text">Extract Text</option>
          <option value="image">Preserve Layout (Images)</option>
        </select>
      </div>

      <div className="max-w-lg mx-auto mb-6 flex items-center gap-2">
        <input
          id="page-breaks"
          type="checkbox"
          checked={pageBreaks}
          onChange={(e) => setPageBreaks(e.target.checked)}
        />
        <label htmlFor="page-breaks" className="text-gray-800">
          Add page breaks
        </label>
      </div>

      <div className="max-w-lg mx-auto mb-6">
        <label htmlFor="output-name" className="block mb-1 font-medium text-gray-800">
          Output File Name
        </label>
        <input
          id="output-name"
          type="text"
          value={outputName}
          onChange={(e) => setOutputName(e.target.value)}
          className="input-base"
        />
      </div>

      <div className="text-center mb-8">
        <button
          onClick={convertPdf}
          disabled={!file || processing || startPage > endPage}
          className={`inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
            processing ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {processing && (
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {processing ? "Converting…" : "Convert"}
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
            Download Word File
          </button>
        </div>
      )}
    </section>
  );
}
