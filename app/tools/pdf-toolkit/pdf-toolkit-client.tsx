// app/tools/pdf-toolkit/pdf-toolkit-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * PDF Toolkit Client
 *
 * Convert any HTML snippet into a PDF—enter your HTML,
 * preview it live, adjust page size/orientation, then
 * download the result 100% client-side.
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

  const previewRef = useRef<HTMLDivElement>(null);

  function handleHtmlChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setHtml(e.target.value);
  }

  async function handleGeneratePdf() {
    if (!previewRef.current) return;
    setError(null);
    setLoading(true);
    try {
      // Render the preview div to a high-resolution canvas
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: paperSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Fit image into page, preserving aspect ratio
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const x = (pageWidth - imgWidth * ratio) / 2;
      const y = (pageHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${fileName}.pdf`);
    } catch (err: unknown) {
      // Narrow error type
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "❌ Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="pdf-toolkit"
      aria-labelledby="pdf-toolkit-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-4">
        <h1
          id="pdf-toolkit-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          PDF Toolkit
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 leading-relaxed">
          Convert any HTML snippet into a PDF—enter your HTML, preview live, choose page size and
          orientation, and download instantly, all in your browser.
        </p>
      </div>

      {/* Controls & Editor */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        {/* File name */}
        <div>
          <label htmlFor="filename-input" className="block text-sm font-medium text-gray-800 mb-1">
            File Name
          </label>
          <input
            id="filename-input"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="document"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition font-mono"
          />
        </div>

        {/* Page settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="orientation-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Orientation
            </label>
            <select
              id="orientation-select"
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as "portrait" | "landscape")
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="papersize-select"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Paper Size
            </label>
            <select
              id="papersize-select"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as "a4" | "letter")}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>
        </div>

        {/* HTML Editor */}
        <div>
          <label htmlFor="html-input" className="block text-sm font-medium text-gray-800 mb-1">
            HTML Content
          </label>
          <textarea
            id="html-input"
            value={html}
            onChange={handleHtmlChange}
            rows={8}
            className="
              w-full p-4 border border-gray-300 rounded-md bg-white
              font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 transition
            "
          />
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={loading}
            className="
              inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition font-medium disabled:opacity-50
            "
          >
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-700 text-sm">{error}</div>
        )}
      </div>

      {/* Live Preview */}
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