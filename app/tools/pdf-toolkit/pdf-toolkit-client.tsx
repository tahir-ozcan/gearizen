// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * PDF Toolkit: Compress & Convert
 *
 * Shrink PDF file sizes without quality loss and extract text to Word documents—all in-browser and offline.
 */
export default function PdfToolkitClient() {
  const [html, setHtml] = useState<string>(
    `<h1 style="text-align:center;">My Document</h1>
<p>This is a PDF generated from HTML content.</p>`
  );
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [paperSize, setPaperSize] = useState<"a4" | "letter">("a4");
  const [fileName, setFileName] = useState<string>("document");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  const previewRef = useRef<HTMLDivElement>(null);

  /** Convert HTML preview into a PDF and download it */
  async function handleGeneratePdf() {
    if (!previewRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation, unit: "px", format: paperSize });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
      const x = (pageW - canvas.width * ratio) / 2;
      const y = (pageH - canvas.height * ratio) / 2;
      pdf.addImage(imgData, "PNG", x, y, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`${fileName}.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  /** Handle selection of a PDF file for compression or extraction */
  function handleUploadChange(e: ChangeEvent<HTMLInputElement>) {
    setUploadFile(e.target.files?.[0] ?? null);
    setExtractedText("");
    setError(null);
  }

  /** Compress the uploaded PDF using pdf-lib */
  async function handleCompressPdf() {
    if (!uploadFile) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
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
      setError(err instanceof Error ? err.message : "Failed to compress PDF.");
    } finally {
      setLoading(false);
    }
  }

  /** Extract text from the uploaded PDF and offer it as a .doc download */
  async function handleExtractText() {
    if (!uploadFile) return;
    setLoading(true);
    setError(null);
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      const buffer = await uploadFile.arrayBuffer();
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
      setError(err instanceof Error ? err.message : "Failed to extract text.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="pdf-toolkit" aria-labelledby="pdf-toolkit-heading" className="space-y-16 text-gray-900 antialiased">
      {/* Heading & Description */}
      <div className="text-center space-y-4 sm:px-0">
        <h1 id="pdf-toolkit-heading" className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          PDF Toolkit: Compress & Convert
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-700 leading-relaxed">
          Shrink PDF file sizes without quality loss and extract text to Word documents—all in-browser and offline.
        </p>
      </div>

      {/* Section: HTML → PDF */}
      <div className="max-w-3xl mx-auto space-y-6 sm:px-0">
        <h2 className="text-xl font-semibold text-gray-800">Generate PDF from HTML</h2>

        <label className="block text-sm font-medium text-gray-800">
          File Name
          <input
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition font-mono"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block text-sm font-medium text-gray-800">
            Orientation
            <select
              value={orientation}
              onChange={e => setOrientation(e.target.value as "portrait" | "landscape")}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-800">
            Paper Size
            <select
              value={paperSize}
              onChange={e => setPaperSize(e.target.value as "a4" | "letter")}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-800">
          HTML Content
          <textarea
            rows={6}
            value={html}
            onChange={e => setHtml(e.target.value)}
            className="mt-1 w-full p-4 border border-gray-300 rounded-md bg-white font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition"
          />
        </label>

        <div className="text-center">
          <button
            onClick={handleGeneratePdf}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Section: PDF Upload → Compress & Extract */}
      <div className="max-w-3xl mx-auto space-y-6 sm:px-0">
        <h2 className="text-xl font-semibold text-gray-800">Compress & Extract from PDF</h2>

        <label className="block text-sm font-medium text-gray-800">
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUploadChange}
            className="mt-1 block w-full text-sm text-gray-700"
          />
        </label>

        {uploadFile && (
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCompressPdf}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
            >
              {loading ? "Compressing..." : "Compress PDF"}
            </button>
            <button
              onClick={handleExtractText}
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 transition disabled:opacity-50"
            >
              {loading ? "Extracting..." : "Extract Text to Word"}
            </button>
          </div>
        )}

        {error && <p className="text-center text-red-700">{error}</p>}

        {extractedText && (
          <label className="block">
            <span className="block text-sm font-medium text-gray-800 mb-1">Extracted Text Preview</span>
            <textarea
              rows={6}
              readOnly
              value={extractedText}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition"
            />
          </label>
        )}
      </div>

      {/* Live HTML Preview */}
      <div className="max-w-3xl mx-auto sm:px-0">
        <div
          ref={previewRef}
          className="prose p-4 border border-gray-300 rounded-lg bg-gray-50"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}