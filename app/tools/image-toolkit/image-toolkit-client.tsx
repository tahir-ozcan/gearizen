// app/tools/image-toolkit/image-toolkit-client.tsx
"use client";

import React, {
  FC,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useCallback,
} from "react";
import Image from "next/image";
import { Trash2, ClipboardCopy, Check, Download } from "lucide-react";

export interface ImageToolkitClientProps {
  /** Main heading text */
  heading?: string;
  /** Subtitle/description text */
  description?: string;
  /** Gradient classes for headings */
  gradientClasses?: string;
  /** Focus-ring Tailwind class */
  focusRingClass?: string;
  /** Override CSS class for primary buttons (gradient) */
  primaryButtonClassName?: string;
  /** Override CSS class for secondary buttons (neutral) */
  secondaryButtonClassName?: string;
  /** Override CSS class for number and range inputs */
  inputClassName?: string;
  /** Extra classes for the root container */
  rootClassName?: string;
}

const ImageToolkitClient: FC<ImageToolkitClientProps> = ({
  heading = "Image Toolkit: Compress & Resize",
  description =
    "Optimize PNG/JPEG images with adjustable quality, resize by pixels, lock aspect ratio, and download high-quality results entirely client-side.",
  gradientClasses = "from-purple-500 via-pink-500 to-yellow-400",
  focusRingClass = "focus:ring-purple-500",
  primaryButtonClassName,
  secondaryButtonClassName,
  inputClassName,
  rootClassName = "",
}) => {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [resizedSrc, setResizedSrc] = useState<string>("");
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.8);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResizedSrc("");
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (!f) {
      setOriginalSrc("");
      return;
    }
    if (!/^image\/(png|jpeg)$/.test(f.type)) {
      setError("❌ Please select a PNG or JPEG image.");
      setOriginalSrc("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setOriginalSrc(reader.result as string);
    reader.readAsDataURL(f);
  };

  // Capture original dimensions
  useEffect(() => {
    if (!originalSrc) return;
    const img = document.createElement("img");
    img.src = originalSrc;
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
  }, [originalSrc]);

  // Redraw canvas on changes
  useEffect(() => {
    if (!originalSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const img = document.createElement("img");
    img.src = originalSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const mime = file?.type === "image/jpeg" ? "image/jpeg" : "image/png";
      const dataUrl =
        mime === "image/jpeg"
          ? canvas.toDataURL(mime, quality)
          : canvas.toDataURL(mime);
      setResizedSrc(dataUrl);
    };
  }, [originalSrc, width, height, quality, file]);

  // Dimension change handlers
  const handleWidthChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const w = Math.max(1, Number(e.target.value) || 1);
      if (lockAspect && origW) {
        setHeight(Math.round((w / origW) * origH));
      }
      setWidth(w);
    },
    [lockAspect, origW, origH]
  );

  const handleHeightChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const h = Math.max(1, Number(e.target.value) || 1);
      if (lockAspect && origH) {
        setWidth(Math.round((h / origH) * origW));
      }
      setHeight(h);
    },
    [lockAspect, origW, origH]
  );

  // Copy Base64 to clipboard
  const copyBase64 = useCallback(async () => {
    if (!resizedSrc) return;
    await navigator.clipboard.writeText(resizedSrc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [resizedSrc]);

  // Download the image
  const downloadImage = useCallback(() => {
    if (!canvasRef.current || !file) return;
    const mime = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      mime,
      mime === "image/jpeg" ? quality : undefined
    );
  }, [file, quality]);

  // Reset all state
  const resetAll = useCallback(() => {
    setFile(null);
    setOriginalSrc("");
    setResizedSrc("");
    setError(null);
  }, []);

  // CSS classes
  const fileButtonClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradientClasses} text-white rounded-md focus:outline-none ${focusRingClass} transition`;

  const primaryBtnClasses =
    primaryButtonClassName ??
    `inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradientClasses} text-white rounded-md focus:outline-none ${focusRingClass} transition disabled:opacity-50 disabled:cursor-not-allowed`;

  const secondaryBtnClasses =
    secondaryButtonClassName ??
    `inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md focus:outline-none ${focusRingClass} hover:bg-gray-200 transition`;

  const inputClasses =
    inputClassName ??
    `w-full p-2 border border-gray-300 rounded-md focus:outline-none ${focusRingClass} transition`;

  return (
    <section
      id="image-toolkit"
      aria-labelledby="image-toolkit-heading"
      className={`space-y-16 text-gray-900 antialiased ${rootClassName}`}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1
          id="image-toolkit-heading"
          className={`bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses} text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight`}
        >
          {heading}
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="text-lg sm:text-xl text-gray-600">{description}</p>
      </div>

      {/* File Upload */}
      <div className="max-w-lg mx-auto flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={fileButtonClasses}
        >
          {file ? "Change Image" : "Select Image"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-lg mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Preview */}
      {resizedSrc && (
        <div className="max-w-lg mx-auto space-y-2">
          <Image
            src={resizedSrc}
            alt="Resized preview"
            width={width}
            height={height}
            unoptimized
            className="mx-auto border rounded-md"
          />
          <p className="text-center text-gray-600">
            Original: {origW}×{origH}px → Resized: {width}×{height}px
          </p>
        </div>
      )}

      {/* Controls */}
      {originalSrc && (
        <div className="max-w-lg mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="width-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Width (px)
              </label>
              <input
                id="width-input"
                type="number"
                min={1}
                value={width}
                onChange={handleWidthChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="height-input"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Height (px)
              </label>
              <input
                id="height-input"
                type="number"
                min={1}
                value={height}
                onChange={handleHeightChange}
                className={inputClasses}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="lock-aspect"
                type="checkbox"
                checked={lockAspect}
                onChange={() => setLockAspect((v) => !v)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="lock-aspect" className="text-sm text-gray-800">
                Lock Aspect Ratio
              </label>
            </div>
            {file?.type === "image/jpeg" && (
              <div>
                <label
                  htmlFor="quality-range"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  JPEG Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  id="quality-range"
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={quality * 100}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={resetAll}
              className={secondaryBtnClasses}
            >
              <Trash2 className="w-5 h-5" />
              Reset
            </button>
            <button
              type="button"
              onClick={copyBase64}
              disabled={!resizedSrc}
              className={primaryBtnClasses}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardCopy className="w-5 h-5" />
              )}
              Copy Base64
            </button>
            <button
              type="button"
              onClick={downloadImage}
              disabled={!resizedSrc}
              className={primaryBtnClasses}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default ImageToolkitClient;