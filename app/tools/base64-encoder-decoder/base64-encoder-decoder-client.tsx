// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { Trash2, ClipboardCopy } from "lucide-react";

export interface Base64EncoderDecoderProps {
  /** Initial mode (“encode” or “decode”) */
  initialMode?: "encode" | "decode";
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings and accents */
  gradientClasses?: string;
  /** Focus-ring Tailwind class */
  focusRingClass?: string;
  /** Labels & placeholders */
  inputLabelEncode?: string;
  inputLabelDecode?: string;
  outputLabelEncode?: string;
  outputLabelDecode?: string;
  placeholderEncode?: string;
  placeholderDecode?: string;
  resultPlaceholder?: string;
  clearButtonLabel?: string;
  copyButtonLabel?: string;
  switchToEncodeLabel?: string;
  switchToDecodeLabel?: string;
  fileUploadButtonLabel?: string;
  /** ARIA label for drop zone */
  dropZoneLabel?: string;
  /** Extra classes for the root container */
  rootClassName?: string;
  /** Override CSS class for input textarea */
  inputClassName?: string;
  /** Override CSS class for output textarea */
  outputClassName?: string;
  /** Override CSS class for drop zone wrapper */
  dropZoneClassName?: string;
  /** Override CSS class for primary action buttons */
  buttonClassName?: string;
  /** Override CSS class for secondary buttons */
  secondaryButtonClassName?: string;
}

export default function Base64EncoderDecoderClient({
  initialMode = "encode",
  heading = "Base64 Encoder/Decoder",
  description =
    "Convert text and files to/from Base64 with drag-and-drop—fully client-side.",
  gradientClasses = "from-[#7c3aed] via-[#ec4899] to-[#fbbf24]",
  focusRingClass = "focus:ring-[#7c3aed]",
  inputLabelEncode = "Text to Encode",
  inputLabelDecode = "Base64 to Decode",
  outputLabelEncode = "Base64 Output",
  outputLabelDecode = "Decoded Text",
  placeholderEncode = "Enter text here…",
  placeholderDecode = "Enter Base64 string…",
  resultPlaceholder = "Result appears here…",
  clearButtonLabel = "Clear All",
  copyButtonLabel = "Copy",
  switchToEncodeLabel = "Switch to Encode",
  switchToDecodeLabel = "Switch to Decode",
  fileUploadButtonLabel = "Upload File",
  dropZoneLabel = "Drag & drop file here",
  rootClassName = "",
  inputClassName,
  outputClassName,
  dropZoneClassName,
  buttonClassName,
  secondaryButtonClassName,
}: Base64EncoderDecoderProps) {
  const [mode, setMode] = useState<"encode" | "decode">(initialMode);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseInputClasses = inputClassName ?? [
    "w-full", "min-h-[8rem]", "bg-transparent", "rounded-md",
    "font-mono", "resize-y", "placeholder-gray-400",
    "focus:outline-none", focusRingClass
  ].join(" ");

  const baseOutputClasses = outputClassName ?? [
    "w-full", "min-h-[8rem]", "p-4", "bg-gray-50",
    "border", "border-gray-300", "rounded-md",
    "font-mono", "resize-none", "placeholder-gray-400",
    "focus:outline-none", focusRingClass
  ].join(" ");

  const dropZoneBase = dropZoneClassName ?? "w-full";
  const primaryButtonClasses = buttonClassName ?? [
    "px-6", "py-2", "rounded-md", "font-medium",
    "focus-visible:outline-none", "focus-visible:ring-2",
    "focus-visible:ring-indigo-500", "transition"
  ].join(" ");
  const secondaryButtonClasses = secondaryButtonClassName ?? [
    "px-4", "py-2", "rounded-md", "text-sm",
    "focus-visible:outline-none", "focus-visible:ring-2",
    "focus-visible:ring-gray-300", "transition"
  ].join(" ");

  const encodeText = useCallback((text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let binary = "";
    data.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }, []);
  const decodeText = useCallback((text: string) => {
    const binary = atob(text);
    const bytes = Uint8Array.from(
      binary.split("").map((c) => c.charCodeAt(0))
    );
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }, []);

  const handleConversion = useCallback(
    (text: string) => {
      if (!text) {
        setOutputText("");
        setError(null);
        return;
      }
      try {
        const result = mode === "encode" ? encodeText(text) : decodeText(text);
        setOutputText(result);
        setError(null);
      } catch {
        setError(mode === "encode" ? "❌ Encoding failed" : "❌ Decoding failed");
        setOutputText("");
      }
    },
    [mode, encodeText, decodeText]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInputText(text);
      handleConversion(text);
    },
    [handleConversion]
  );

  const handleFile = useCallback((file: File) => {
    fileInputRef.current!.value = "";
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        const encoded = btoa(binary);
        setInputText(file.name);
        setOutputText(encoded);
        setError(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
    } catch {
      /* silent */
    }
  }, [outputText]);
  const clearAll = useCallback(() => {
    setInputText("");
    setOutputText("");
    setError(null);
    inputRef.current?.focus();
  }, []);

  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className={`text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Heading */}
      <div className="text-center space-y-4 mb-10">
        <h1
          id="base64-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div
          className={`mx-auto h-1 w-32 rounded-full bg-gradient-to-r ${gradientClasses}`}
        />
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Input Block */}
        <div>
          <label
            htmlFor="base64-input"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? inputLabelEncode : inputLabelDecode}
          </label>
          <div
            role="textbox"
            aria-label={dropZoneLabel}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`${dropZoneBase} border-2 border-dashed ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } rounded-md transition`}
          >
            <textarea
              id="base64-input"
              ref={inputRef}
              value={inputText}
              placeholder={
                mode === "encode" ? placeholderEncode : placeholderDecode
              }
              onChange={handleInputChange}
              className={baseInputClasses}
            />
          </div>
        </div>

        {/* Output Block */}
        <div>
          <label
            htmlFor="base64-output"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {mode === "encode" ? outputLabelEncode : outputLabelDecode}
          </label>
          <textarea
            id="base64-output"
            value={outputText}
            readOnly
            placeholder={resultPlaceholder}
            className={baseOutputClasses}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="text-red-700 bg-red-50 border border-red-200 p-4 rounded-md"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputText}
            aria-label={copyButtonLabel}
            className={`${primaryButtonClasses} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ClipboardCopy className="w-5 h-5 inline mr-2" aria-hidden="true" />
            {copyButtonLabel}
          </button>

          <button
            type="button"
            onClick={clearAll}
            className={`${secondaryButtonClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            <Trash2 className="w-5 h-5 inline mr-2" aria-hidden="true" />
            {clearButtonLabel}
          </button>

          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "encode" ? "decode" : "encode"))
            }
            className={`${secondaryButtonClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            {mode === "encode" ? switchToDecodeLabel : switchToEncodeLabel}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${secondaryButtonClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            {fileUploadButtonLabel}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="sr-only"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </section>
  );
}