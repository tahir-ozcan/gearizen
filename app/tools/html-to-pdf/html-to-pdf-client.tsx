// app/tools/html-to-pdf/html-to-pdf-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";

export default function HtmlToPdfClient() {
  const [htmlInput, setHtmlInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  // new controls for layout
  const [margin, setMargin] = useState<number>(0.5);
  const [format, setFormat] = useState<"letter" | "a4">("letter");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlInput(e.target.value);
    setError(null);
  };

  const generatePdf = async () => {
    if (!htmlInput.trim()) {
      setError("❌ Please enter some HTML to convert.");
      return;
    }
    if (!previewRef.current) return;

    setProcessing(true);
    try {
      // dynamic import
      const { default: html2pdf } = await import("html2pdf.js");
      // inject HTML
      previewRef.current.innerHTML = htmlInput;
      await html2pdf()
        .set({
          margin,                // controlled margin (in inches)
          filename: "document.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format, orientation },
        })
        .from(previewRef.current)
        .save();
    } catch (err) {
      console.error(err);
      setError(
        "❌ An error occurred while generating the PDF. Check your HTML or settings."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section
      id="html-to-pdf"
      aria-labelledby="html-to-pdf-heading"
      className="space-y-16 text-gray-900 antialiased"
    >
      {/* Heading & Description */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="html-to-pdf-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
          "
        >
          HTML to PDF Converter
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Render any webpage or HTML snippet into a PDF document client-side with custom
          layout and margins.
        </p>
      </div>

      {/* Input & Layout Controls */}
      <div className="max-w-3xl mx-auto space-y-8 sm:px-0">
        <label htmlFor="html-input" className="sr-only">
          HTML Input
        </label>
        <textarea
          id="html-input"
          value={htmlInput}
          onChange={handleInputChange}
          placeholder="<h1>Hello, world!</h1>"
          rows={10}
          className="
            w-full p-4 border border-gray-300 rounded-md bg-white
            focus:outline-none focus:ring-2 focus:ring-[#7c3aed]
            font-mono text-sm resize-y transition
          "
        />

        {/* layout settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="margin-input" className="block text-sm font-medium text-gray-800">
              Margin (in)
            </label>
            <input
              id="margin-input"
              type="number"
              step={0.1}
              min={0}
              max={2}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            />
          </div>
          <div>
            <label htmlFor="format-select" className="block text-sm font-medium text-gray-800">
              Page Format
            </label>
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as "letter" | "a4")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            >
              <option value="letter">Letter</option>
              <option value="a4">A4</option>
            </select>
          </div>
          <div>
            <label htmlFor="orient-select" className="block text-sm font-medium text-gray-800">
              Orientation
            </label>
            <select
              id="orient-select"
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as "portrait" | "landscape")
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7c3aed] transition"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={generatePdf}
            disabled={processing}
            className={`
              px-6 py-3 bg-indigo-600 text-white rounded-md
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition font-medium ${processing ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {processing ? "Generating PDF…" : "Generate PDF"}
          </button>
        </div>
      </div>

      {/* Hidden preview container for html2pdf */}
      <div ref={previewRef} className="hidden" />
    </section>
  );
}