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
      setError("Please enter some HTML to convert.");
      return;
    }
    if (!previewRef.current) return;

    setProcessing(true);
    try {
      // Dynamically import html2pdf.js in the browser
      const html2pdf = (await import("html2pdf.js")).default;
      // Inject the HTML into a hidden container
      previewRef.current.innerHTML = htmlInput;
      // Configure PDF options
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
    } catch (e) {
      console.error(e);
      setError("An error occurred while generating the PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section
      id="html-to-pdf"
      aria-labelledby="html-to-pdf-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased selection:bg-indigo-200 selection:text-indigo-900"
    >
      <h1
        id="html-to-pdf-heading"
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 tracking-tight"
      >
        HTML to PDF Converter
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Paste or type your HTML markup below to generate a PDF file instantly.
        Everything runs client-side—no backend, no signup required.
      </p>

      <label htmlFor="html-input" className="sr-only">
        HTML input
      </label>
      <textarea
        id="html-input"
        value={htmlInput}
        onChange={handleInputChange}
        placeholder="<h1>Hello, world!</h1>"
        rows={10}
        className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {error && (
        <p role="alert" className="mt-4 text-red-600 text-sm">
          {error}
        </p>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={generatePdf}
          disabled={processing}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium ${
            processing ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {processing ? "Generating PDF…" : "Generate PDF"}
        </button>
      </div>

      {/* Hidden preview container for html2pdf */}
      <div ref={previewRef} className="hidden" />
    </section>
  );
}