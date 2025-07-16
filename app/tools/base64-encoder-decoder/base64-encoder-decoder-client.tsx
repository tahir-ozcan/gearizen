// app/tools/base64-encoder-decoder/base64-encoder-decoder-client.tsx
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  FormEvent,
  DragEvent,
  KeyboardEvent,
} from "react";
import { Trash2, ClipboardCopy, Paperclip } from "lucide-react";

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
  encodeButtonLabel?: string;
  decodeButtonLabel?: string;
  clearButtonLabel?: string;
  switchToEncodeLabel?: string;
  switchToDecodeLabel?: string;
  copyButtonAriaLabel?: string;
  fileUploadButtonLabel?: string;
  /** ARIA label for drop zone */
  dropZoneLabel?: string;
  /** Extra classes for the root container */
  rootClassName?: string;
  /** Override CSS class for input textarea */
  inputClassName?: string;
  /** Override CSS class for drop zone container */
  dropZoneClassName?: string;
  /** Override CSS class for primary action button (encode/decode) */
  actionButtonClassName?: string;
  /** Override CSS class for secondary buttons (clear, switch mode, file-upload) */
  secondaryButtonClassName?: string;
  /** Override CSS class for the copy button */
  copyButtonClassName?: string;
}

export default function Base64EncoderDecoderClient({
  initialMode = "encode",
  heading = "Base64 Encoder/Decoder",
  description =
    "Convert text and files to and from Base64 with drag-and-drop support—no server, fully client-side.",
  gradientClasses = "from-[#7c3aed] via-[#ec4899] to-[#fbbf24]",
  focusRingClass = "focus:ring-[#7c3aed]",
  inputLabelEncode = "Text to Encode",
  inputLabelDecode = "Base64 to Decode",
  outputLabelEncode = "Base64 Output",
  outputLabelDecode = "Decoded Text",
  placeholderEncode = "Enter text here…",
  placeholderDecode = "Enter Base64 string…",
  resultPlaceholder = "Result appears here…",
  encodeButtonLabel = "Encode →",
  decodeButtonLabel = "Decode →",
  clearButtonLabel = "Clear All",
  switchToEncodeLabel = "Switch to Encode",
  switchToDecodeLabel = "Switch to Decode",
  copyButtonAriaLabel = "Copy output",
  fileUploadButtonLabel = "Upload File",
  dropZoneLabel = "Drag & drop file here, or click to upload",
  rootClassName = "",
  inputClassName,
  dropZoneClassName,
  actionButtonClassName,
  secondaryButtonClassName,
  copyButtonClassName,
}: Base64EncoderDecoderProps) {
  const [mode, setMode] = useState<"encode" | "decode">(initialMode);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Class-name overrides
  const inputClasses = inputClassName
    ? inputClassName
    : `w-full h-48 p-4 border border-gray-300 rounded-md bg-white ${focusRingClass} font-mono resize-y transition focus:outline-none`;
  const dropZoneClasses = dropZoneClassName
    ? dropZoneClassName
    : `flex flex-col p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition cursor-pointer`;
  const primaryButtonClasses = actionButtonClassName
    ? actionButtonClassName
    : `px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none transition font-medium`;
  const secondaryButtonClasses = secondaryButtonClassName
    ? secondaryButtonClassName
    : `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300 focus:outline-none transition text-sm`;
  const copyBtnClasses = copyButtonClassName
    ? copyButtonClassName
    : `absolute top-2 right-2 p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition`;

  // Helpers
  const clearAll = useCallback(() => {
    setInputText("");
    setOutputText("");
    setError(null);
    setLiveMessage("");
    inputRef.current?.focus();
  }, []);

  const encodeText = useCallback((text: string) => {
    // UTF-8 safe
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let binary = "";
    data.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }, []);

  const decodeText = useCallback((text: string) => {
    const binary = atob(text);
    const bytes = Uint8Array.from(
      [...binary].map((char) => char.charCodeAt(0))
    );
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }, []);

  const announce = (msg: string) => {
    setLiveMessage(msg);
    setTimeout(() => setLiveMessage(""), 3000);
  };

  // File → Base64
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        let binary = "";
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        setMode("encode");
        setInputText("");
        setOutputText(btoa(binary));
        setError(null);
        announce("File converted to Base64");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  const handleDropZoneKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    },
    []
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputText(e.target.value);
      setError(null);
      setOutputText("");
    },
    []
  );
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setOutputText("");
      try {
        const result =
          mode === "encode"
            ? encodeText(inputText)
            : decodeText(inputText);
        setOutputText(result);
        announce(
          mode === "encode" ? "Text encoded" : "Text decoded"
        );
      } catch {
        const msg =
          mode === "encode" ? "❌ Encoding failed" : "❌ Decoding failed";
        setError(msg);
        announce(msg);
      }
    },
    [mode, inputText, encodeText, decodeText]
  );
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      announce("Copied to clipboard");
    } catch {
      announce("❌ Copy failed");
    }
  }, [outputText]);
  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const inputCount = inputText.length.toLocaleString();
  const outputCount = outputText.length.toLocaleString();

  return (
    <section
      id="base64-encoder-decoder"
      aria-labelledby="base64-heading"
      className={`space-y-12 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Invisible live-region for announcements */}
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {/* Heading & subtitle */}
      <div className="text-center space-y-4 px-4">
        <h1
          id="base64-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div
          className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${gradientClasses}`}
        />
        <p className="mt-2 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 px-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input area + file upload */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="base64-input"
              className="block text-sm font-medium text-gray-800"
            >
              {mode === "encode"
                ? inputLabelEncode
                : inputLabelDecode}
            </label>
            <textarea
              id="base64-input"
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              placeholder={
                mode === "encode"
                  ? placeholderEncode
                  : placeholderDecode
              }
              className={inputClasses}
            />
            <p className="text-xs text-gray-500">
              {inputCount} characters
            </p>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={secondaryButtonClasses}
                aria-label={fileUploadButtonLabel}
              >
                <Paperclip className="w-5 h-5" />
                {fileUploadButtonLabel}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="sr-only"
                onChange={handleFileSelect}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Drop-zone & output */}
          <div
            role="button"
            tabIndex={0}
            aria-label={dropZoneLabel}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onKeyDown={handleDropZoneKeyDown}
            className={dropZoneClasses}
          >
            <label
              htmlFor="base64-output"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {mode === "encode"
                ? outputLabelEncode
                : outputLabelDecode}
            </label>
            <div className="relative flex-1">
              <textarea
                id="base64-output"
                value={outputText}
                readOnly
                placeholder={resultPlaceholder}
                className={`${inputClasses} bg-transparent resize-none`}
                aria-live="polite"
                aria-readonly="true"
              />
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputText}
                className={copyBtnClasses}
                aria-label={copyButtonAriaLabel}
                aria-disabled={!outputText}
              >
                <ClipboardCopy className="w-6 h-6" />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {outputCount} characters
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className={primaryButtonClasses}>
            {mode === "encode"
              ? encodeButtonLabel
              : decodeButtonLabel}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className={secondaryButtonClasses}
          >
            <Trash2 className="w-5 h-5" />
            {clearButtonLabel}
          </button>
          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "encode" ? "decode" : "encode"))
            }
            className={secondaryButtonClasses}
          >
            {mode === "encode"
              ? switchToDecodeLabel
              : switchToEncodeLabel}
          </button>
        </div>
      </form>
    </section>
  );
}