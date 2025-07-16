"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  DragEvent,
  KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";

/** Dynamic imports for icons to reduce initial bundle size */
const Trash2Icon = dynamic(() =>
  import("lucide-react").then((mod) => mod.Trash2)
);
const ClipboardCopyIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.ClipboardCopy)
);
const PaperclipIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.Paperclip)
);

/**
 * Translations for all UI strings in the Base64 tool.
 */
export interface Translations {
  toolTitle: string;
  inputLabelEncode: string;
  inputLabelDecode: string;
  inputPlaceholderEncode: string;
  inputPlaceholderDecode: string;
  outputLabelEncode: string;
  outputLabelDecode: string;
  outputPlaceholder: string;
  encodeButtonLabel: string;
  decodeButtonLabel: string;
  clearButtonLabel: string;
  switchToEncodeLabel: string;
  switchToDecodeLabel: string;
  copiedNotification: string;
  copyErrorNotification: string;
  encodingErrorMessage: string;
  decodingErrorMessage: string;
  dragDropHint: string;
}

/**
 * Theme tokens to allow overriding colors, fonts, etc.
 */
export interface ThemeTokens {
  primaryColor?: string;    /** e.g. "indigo-600" or CSS variable */
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontFamily?: string;      /** e.g. "font-mono" or "font-sans" */
}

/**
 * Layout options to show or hide specific UI features.
 */
export interface LayoutOptions {
  showDragDropArea?: boolean;
  showIcons?: boolean;
}

/**
 * Props for Base64EncoderDecoderClient component.
 */
export interface Base64EncoderDecoderProps {
  /** Initial mode: 'encode' or 'decode'. Default 'encode'. */
  initialMode?: "encode" | "decode";
  /** Override any of the default translations. */
  translations?: Partial<Translations>;
  /** Override default theme tokens. */
  theme?: ThemeTokens;
  /** Control visibility of extra UI features. */
  layout?: LayoutOptions;
}

/** Default English translations. */
const defaultTranslations: Translations = {
  toolTitle: "Base64 Encoder/Decoder",
  inputLabelEncode: "Text to Encode",
  inputLabelDecode: "Base64 to Decode",
  inputPlaceholderEncode: "Enter text or drop a file…",
  inputPlaceholderDecode: "Enter Base64 string to decode…",
  outputLabelEncode: "Base64 Output",
  outputLabelDecode: "Decoded Text",
  outputPlaceholder: "Result appears here…",
  encodeButtonLabel: "Encode →",
  decodeButtonLabel: "Decode →",
  clearButtonLabel: "Clear All",
  switchToEncodeLabel: "Switch to Encode",
  switchToDecodeLabel: "Switch to Decode",
  copiedNotification: "✅ Copied to clipboard!",
  copyErrorNotification: "❌ Copy failed.",
  encodingErrorMessage: "❌ Encoding failed.",
  decodingErrorMessage: "❌ Decoding failed.",
  dragDropHint: "Drag and drop a file here or click to select.",
};

/** Default theme settings. */
const defaultTheme: Required<ThemeTokens> = {
  primaryColor: "indigo-600",
  textColor: "gray-900",
  borderColor: "gray-300",
  backgroundColor: "white",
  fontFamily: "font-mono",
};

/** Default layout settings. */
const defaultLayout: Required<LayoutOptions> = {
  showDragDropArea: true,
  showIcons: true,
};

/**
 * Base64 Encoder/Decoder Client Component
 *
 * Convert text and files to and from Base64, fully client-side and customizable.
 *
 * @example
 * ```tsx
 * <Base64EncoderDecoderClient
 *   initialMode="decode"
 *   translations={{ encodeButtonLabel: "Encode Base64" }}
 *   theme={{ primaryColor: "purple-500", fontFamily: "font-sans" }}
 *   layout={{ showIcons: false }}
 * />
 * ```
 */
export default function Base64EncoderDecoderClient({
  initialMode = "encode",
  translations = {},
  theme = {},
  layout = {},
}: Base64EncoderDecoderProps) {
  const t: Translations = { ...defaultTranslations, ...translations };
  const th = { ...defaultTheme, ...theme };
  const lo = { ...defaultLayout, ...layout };

  const [mode, setMode] = useState<"encode" | "decode">(initialMode);
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Focus the text input */
  const focusInput = () => inputRef.current?.focus();

  /**
   * Clear all fields and reset focus.
   */
  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
    focusInput();
  }

  /**
   * Encode a UTF-8 string to Base64.
   * @param text UTF-8 input
   */
  function encodeText(text: string): string {
    if (!text) return "";
    const utf8Bytes = new TextEncoder().encode(text);
    return btoa(String.fromCharCode(...utf8Bytes));
  }

  /**
   * Decode a Base64 string to UTF-8.
   * Throws if invalid input.
   * @param base64 Base64 input
   */
  function decodeText(base64: string): string {
    if (!base64) return "";
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  /** Handle file drops for encoding */
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        const str = String.fromCharCode(...bytes);
        setMode("encode");
        setInput("");
        setOutput(btoa(str));
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /** Prevent default dragover behavior */
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  /** Trigger hidden file input on keyboard activation */
  function handleDropZoneKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }

  /** Handle manual file selection */
  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(reader.result);
        setMode("encode");
        setInput("");
        setOutput(btoa(String.fromCharCode(...bytes)));
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /** Update input text */
  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    setError(null);
    setOutput("");
  }

  /** Process encode/decode on submit */
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput("");
    try {
      const result = mode === "encode" ? encodeText(input) : decodeText(input);
      setOutput(result);
    } catch {
      setError(
        mode === "encode" ? t.encodingErrorMessage : t.decodingErrorMessage
      );
    }
  }

  /** Copy output to clipboard with user feedback */
  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      alert(t.copiedNotification);
    } catch {
      alert(t.copyErrorNotification);
    }
  }

  const inputCount = input.length.toLocaleString();
  const outputCount = output.length.toLocaleString();

  return (
    <section
      id="base64-tool"
      aria-labelledby="base64-tool-heading"
      role="region"
      className={`space-y-8 ${th.textColor}`}
    >
      {/* Title & Hint */}
      <div className="text-center">
        <h1 id="base64-tool-heading" className="text-3xl font-bold">
          {t.toolTitle}
        </h1>
        {lo.showDragDropArea && (
          <p className="text-sm text-gray-600 mt-1">{t.dragDropHint}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-6"
        noValidate
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="flex flex-col">
            <label htmlFor="base64-input" className="font-medium mb-1">
              {mode === "encode"
                ? t.inputLabelEncode
                : t.inputLabelDecode}
            </label>
            <textarea
              id="base64-input"
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === "encode"
                  ? t.inputPlaceholderEncode
                  : t.inputPlaceholderDecode
              }
              className={`
                w-full min-h-[200px] p-3 border ${th.borderColor}
                rounded focus:outline-none focus:ring-2 focus:ring-${th.primaryColor}
                ${th.fontFamily}
              `}
            />
            <p className="mt-1 text-xs text-gray-500">
              {inputCount} characters
            </p>
          </div>

          {/* Output / Drag-Drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onKeyDown={handleDropZoneKeyDown}
            role={lo.showDragDropArea ? "button" : undefined}
            tabIndex={lo.showDragDropArea ? 0 : undefined}
            aria-label="File drop zone"
            className={`
              relative flex flex-col p-3 border ${th.borderColor}
              rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-${th.primaryColor}
              ${!lo.showDragDropArea ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="sr-only"
            />
            <label htmlFor="base64-output" className="font-medium mb-1">
              {mode === "encode"
                ? t.outputLabelEncode
                : t.outputLabelDecode}
            </label>
            <textarea
              id="base64-output"
              value={output}
              readOnly
              placeholder={t.outputPlaceholder}
              className={`
                w-full min-h-[200px] p-3 pr-10 border ${th.borderColor}
                rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-${th.primaryColor}
                ${th.fontFamily}
              `}
            />
            {lo.showIcons && (
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                aria-label="Copy output"
                className="absolute top-2 right-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <ClipboardCopyIcon />
              </button>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {outputCount} characters
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className={`
              px-5 py-2 bg-${th.primaryColor} text-white rounded
              focus:outline-none focus:ring-2 focus:ring-${th.primaryColor}
            `}
          >
            {mode === "encode"
              ? t.encodeButtonLabel
              : t.decodeButtonLabel}
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {lo.showIcons && <Trash2Icon />}
            {t.clearButtonLabel}
          </button>

          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "encode" ? "decode" : "encode"))
            }
            className="inline-flex items-center gap-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {lo.showIcons && <PaperclipIcon />}
            {mode === "encode"
              ? t.switchToDecodeLabel
              : t.switchToEncodeLabel}
          </button>
        </div>
      </form>
    </section>
  );
}