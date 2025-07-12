// app/tools/pdf-to-word/pdf-to-word-client.tsx
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import PreviewImage from "@/components/PreviewImage";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf";
import { pdfToDocx } from "@/lib/pdf-to-docx";

export default function PdfToWordClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewSize, setPreviewSize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [options, setOptions] = useState({
    mode: "text" as "text" | "image",
    includeImages: false,
    orientation: "portrait" as "portrait" | "landscape",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDocUrl("");
    setError(null);
    setPreviewUrl("");
    setFile(e.target.files?.[0] ?? null);
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
      const blob = await pdfToDocx(arrayBuffer, options);
      const url = URL.createObjectURL(blob);
      setDocUrl(url);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "An error occurred during conversion.",
      );
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        const worker = (
          await import("pdfjs-dist/legacy/build/pdf.worker.mjs?worker&url")
        ).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;
        const page: PDFPageProxy = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        setPreviewUrl(canvas.toDataURL());
        setPreviewSize({ w: canvas.width, h: canvas.height });
      } catch {}
    })();
  }, [file]);

  const downloadDoc = () => {
    if (!docUrl || !file) return;
    const a = document.createElement("a");
    a.href = docUrl;
    a.download = file.name.replace(/\.pdf$/i, "") + ".docx";
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
        Upload a PDF and convert its text to a Word document—all right in your
        browser.
      </p>

      <div className="max-w-lg mx-auto mb-6">
        <label
          htmlFor="pdf-upload"
          className="block mb-2 font-medium text-gray-800"
        >
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

      <div className="max-w-lg mx-auto mb-6 space-y-4">
        <fieldset>
          <legend className="font-medium mb-2">Mode</legend>
          <label className="mr-4 inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="text"
              checked={options.mode === "text"}
              onChange={() => setOptions({ ...options, mode: "text" })}
              className="mr-1"
            />
            Text Only
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="image"
              checked={options.mode === "image"}
              onChange={() => setOptions({ ...options, mode: "image" })}
              className="mr-1"
            />
            Page Images
          </label>
        </fieldset>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            disabled={options.mode !== "text"}
            checked={options.includeImages}
            onChange={(e) =>
              setOptions({ ...options, includeImages: e.target.checked })
            }
          />
          Include page snapshots
        </label>
        <label className="block">
          <span className="block mb-1 font-medium">Orientation</span>
          <select
            value={options.orientation}
            onChange={(e) =>
              setOptions({
                ...options,
                orientation: e.target.value as "portrait" | "landscape",
              })
            }
            className="input-base"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
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

      <div className="text-center mb-8">
        <button
          onClick={convertPdf}
          disabled={!file || processing}
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
