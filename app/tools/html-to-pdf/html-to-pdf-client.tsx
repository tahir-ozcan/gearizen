// app/tools/html-to-pdf/html-to-pdf-client.tsx
"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  FC,
} from "react";
import { Trash2, ArrowDown } from "lucide-react";

export interface HtmlToPdfClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus‑ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS class for primary button */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary button */
  secondaryButtonClassName?: string;
  /** Override CSS class for textarea */
  textareaClassName?: string;
  /** Extra classes for the root section */
  rootClassName?: string;
}

const HtmlToPdfClient: FC<HtmlToPdfClientProps> = ({
  heading = "HTML to PDF Converter",
  description =
    "Render any HTML snippet into a high‑quality PDF entirely client‑side, with custom margins, format, and orientation.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  primaryButtonClassName,
  secondaryButtonClassName,
  textareaClassName,
  rootClassName = "",
}) => {
  const [htmlInput, setHtmlInput] = useState<string>("");
  const [margin, setMargin] = useState<number>(0.5);
  const [format, setFormat] = useState<"letter" | "a4">("letter");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Shared classes
  const baseTextareaClasses = textareaClassName ??
    `w-full p-4 border border-gray-300 rounded-md bg-white font-mono resize-y focus:outline-none ${focusRingClass} transition`;

  const primaryBtnClasses = primaryButtonClassName ??
    `inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`;

  const secondaryBtnClasses = secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md transition hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300`;

  // Handle input
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlInput(e.target.value);
    setError(null);
  };

  // Generate PDF
  const generatePdf = useCallback(async () => {
    if (!htmlInput.trim()) {
      setError("❌ Please enter some HTML to convert.");
      return;
    }
    if (!previewRef.current) return;

    setProcessing(true);
    setError(null);

    try {
      const { default: html2pdf } = await import("html2pdf.js");

      // Build a hidden container for rendering
      const dpi = 96;
      const size = format === "letter"
        ? { w: 8.5, h: 11 }
        : { w: 8.27, h: 11.69 };
      const pageW = orientation === "portrait" ? size.w : size.h;
      const pageH = orientation === "portrait" ? size.h : size.w;

      const container = previewRef.current;
      container.innerHTML = htmlInput;
      container.style.width = `${pageW * dpi}px`;
      container.style.minHeight = `${pageH * dpi}px`;
      container.style.background = "#ffffff";

      await html2pdf()
        .set({
          margin,
          filename: "document.pdf",
          image: { type: "jpeg", quality: 1.0 },
          html2canvas: {
            scale: 3,
            logging: false,
            dpi: dpi * 2,
            letterRendering: true,
          },
          jsPDF: {
            unit: "in",
            format,
            orientation,
            compressPdf: true,
          },
        })
        .from(container)
        .save();
    } catch (err) {
      console.error(err);
      setError(
        "❌ An error occurred while generating the PDF. Check your HTML or settings."
      );
    } finally {
      setProcessing(false);
    }
  }, [htmlInput, margin, format, orientation]);

  // Clear all
  const clearAll = useCallback(() => {
    setHtmlInput("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  return (
    <section
      id="html-to-pdf"
      aria-labelledby="html-to-pdf-heading"
      className={`space-y-16 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="html-to-pdf-heading"
          className={`
            bg-clip-text text-transparent
            bg-gradient-to-r ${gradientClasses}
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          `}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-6 justify-center">
          <div className="flex flex-col">
            <label htmlFor="margin-input" className="text-sm font-medium text-gray-800 mb-1">
              Margin (inches)
            </label>
            <input
              id="margin-input"
              type="number"
              step={0.1}
              min={0}
              max={2}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className={`
                w-24 p-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition text-sm
              `}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="format-select" className="text-sm font-medium text-gray-800 mb-1">
              Page Format
            </label>
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as "letter" | "a4")}
              className={`
                w-28 p-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition text-sm
              `}
            >
              <option value="letter">Letter</option>
              <option value="a4">A4</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="orientation-select" className="text-sm font-medium text-gray-800 mb-1">
              Orientation
            </label>
            <select
              id="orientation-select"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
              className={`
                w-32 p-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition text-sm
              `}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        {/* HTML Input */}
        <div>
          <label htmlFor="html-input" className="block text-sm font-medium text-gray-800 mb-1">
            HTML Input
          </label>
          <textarea
            id="html-input"
            ref={inputRef}
            value={htmlInput}
            onChange={handleInputChange}
            placeholder="<h1>Hello, world!</h1>"
            rows={10}
            className={baseTextareaClasses}
          />
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="text-red-700 bg-red-50 border border-red-200 p-4 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <button
            type="button"
            onClick={generatePdf}
            disabled={processing}
            className={primaryButtonClassName ?? primaryBtnClasses}
          >
            <ArrowDown className="w-5 h-5" aria-hidden="true" />
            {processing ? "Generating PDF…" : "Generate PDF"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className={secondaryButtonClassName ?? secondaryBtnClasses}
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            Clear All
          </button>
        </div>
      </div>

      {/* Hidden preview container for html2pdf.js */}
      <div ref={previewRef} className="hidden" />
    </section>
  );
};

export default HtmlToPdfClient;