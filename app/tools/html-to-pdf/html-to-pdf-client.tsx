// app/tools/html-to-pdf/html-to-pdf-client.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";

export default function HtmlToPdfClient() {
  const [htmlInput, setHtmlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
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
      const { default: html2pdf } = await import("html2pdf.js");
      previewRef.current.innerHTML = htmlInput;
      await html2pdf()
        .set({
          margin: 0.5,
          filename: "document.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(previewRef.current)
        .save();
    } catch (err) {
      console.error(err);
      setError("❌ An error occurred while generating the PDF.");
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
      <div className="text-center sm:px-0 space-y-4">
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
        <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Paste or type your HTML markup below to generate a PDF file instantly—100% client-side, no backend or signup required.
        </p>
      </div>

      {/* Form */}
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
              transition font-medium
              ${processing ? "opacity-60 cursor-not-allowed" : ""}
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